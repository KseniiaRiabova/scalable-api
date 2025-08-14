import cluster from 'cluster';
import { cpus } from 'os';
import express, { Request, Response } from 'express';
import { createClient } from 'redis';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

// Define a type for our user data
interface User {
  id: number;
  name: string;
}

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Starting ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    console.log('Starting a new worker...');
    cluster.fork();
  });

  // Handle worker online
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });
} else {
  // Worker process
  const app = express();

  // Create Redis client
  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  // Configure rate limiting with Redis
  const limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limiting each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
  });

  // Apply rate limiting to all requests
  app.use(limiter);

  // Simulate a database connection
  const fakeDB = (): Promise<User> =>
    new Promise<User>((resolve) => {
      setTimeout(() => {
        console.log(`Worker ${process.pid}: Fetching from DB`);
        resolve({ id: 1, name: 'Ksusha' });
      }, 1000);
    });

  app.get('/user', async (req: Request, res: Response) => {
    try {
      const cacheKey = 'user:1';
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        console.log(`Worker ${process.pid}: Returning from cache`);
        res.set('Cache-Control', 'public, max-age=60');
        return res.json(JSON.parse(cached));
      }

      const data = await fakeDB();
      await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 });
      console.log(`Worker ${process.pid}: Data cached and returned`);
      res.json(data);
    } catch (error) {
      console.error(`Worker ${process.pid}: Error fetching user:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'OK',
      worker: process.pid,
      timestamp: new Date().toISOString(),
    });
  });

  const PORT: number = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Worker ${process.pid}: Server is running on http://localhost:${PORT}`
    );
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log(
      `Worker ${process.pid}: Received SIGTERM, shutting down gracefully`
    );
    redisClient.quit();
    process.exit(0);
  });
}
