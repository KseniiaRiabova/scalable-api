import cluster from 'cluster';
import { cpus } from 'os';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createClient } from 'redis';

interface User {
  id: number;
  name: string;
}

const numCPUs = Math.min(cpus().length, 8);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Starting ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    console.log('Starting a new worker...');
    cluster.fork();
  });

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
} else {
  const app = express();

  console.log(
    `Worker ${process.pid}: Express app created, setting up middlewares...`
  );

  app.use(cors());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  const redisClient = createClient({
    database: 2,
  });

  redisClient.connect().catch((error) => {
    console.error(`Worker ${process.pid}: Redis connection error:`, error);
  });

  const fakeDB = (): Promise<User> =>
    new Promise<User>((resolve) => {
      resolve({ id: 1, name: 'Ksusha' });
    });

  app.get('/user', async (req: Request, res: Response) => {
    try {
      const cacheKey = 'user:1';
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        res.set('Cache-Control', 'public, max-age=60');
        const cachedData = JSON.parse(cached);
        return res.json({
          ...cachedData,
          worker: process.pid,
          source: 'cache',
        });
      }

      const data = await fakeDB();
      await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 });
      res.json({
        ...data,
        worker: process.pid,
        source: 'database',
      });
    } catch (error) {
      console.error(`Worker ${process.pid}: Error fetching user:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/cpu-intensive', async (req: Request, res: Response) => {
    try {
      const startTime = Date.now();

      let result = 0;
      for (let i = 0; i < 5000000; i++) {
        result += Math.sqrt(i) * Math.sin(i) * Math.cos(i);
      }

      const matrix = [];
      for (let i = 0; i < 1000; i++) {
        matrix.push(new Array(100).fill(0).map(() => Math.random()));
      }

      const processingTime = Date.now() - startTime;

      res.json({
        message: `Heavy CPU work completed by worker ${process.pid}`,
        processingTime: `${processingTime}ms`,
        result: Math.round(result),
        matrixSize: matrix.length,
        worker: process.pid,
        api: 'Scaled (Clustered)',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(
        `Worker ${process.pid}: Error in CPU-intensive operation:`,
        error
      );
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'OK',
      worker: process.pid,
      timestamp: new Date().toISOString(),
    });
  });

  const PORT: number = parseInt(process.env.PORT || '3001');

  app.listen(PORT, () => {
    console.log(
      `Worker ${process.pid}: Server is running on http://localhost:${PORT}`
    );
  });

  process.on('SIGTERM', () => {
    console.log(
      `Worker ${process.pid}: Received SIGTERM, shutting down gracefully`
    );
    redisClient.quit();
    process.exit(0);
  });
}
