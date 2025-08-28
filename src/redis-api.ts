import express, { Request, Response } from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import path from 'path';

interface User {
  id: number;
  name: string;
}

const config = {
  port: parseInt(process.env.PORT || '3000'),
  cacheExpiry: 60,
};

console.log('Optimized API Configuration:', {
  port: config.port,
  cacheExpiry: `${config.cacheExpiry}s`,
  rateLimiting: 'Handled at gateway level',
});

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const redisClient = createClient();
redisClient.connect().catch(console.error);

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
      message: 'Heavy CPU work completed',
      processingTime: `${processingTime}ms`,
      result: Math.round(result),
      matrixSize: matrix.length,
      worker: 'Single Process',
      api: 'Redis (Optimized)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in CPU-intensive operation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const fakeDB = (): Promise<User> => {
  return new Promise<User>((resolve) => {
    resolve({ id: 1, name: 'Ksusha' });
  });
};

app.get('/user', async (req: Request, res: Response) => {
  try {
    const cacheKey = 'user:1';
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log('Cache HIT');
      res.set('Cache-Control', 'public, max-age=60');
      return res.json({
        ...JSON.parse(cached),
        source: 'cache',
      });
    }

    console.log('Cache MISS - fetching from database');

    const data = await fakeDB();
    await redisClient.set(cacheKey, JSON.stringify(data), {
      EX: config.cacheExpiry,
    });

    res.json({
      ...data,
      source: 'database',
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK - Optimized (Redis Cache)',
    version: 'Redis caching enabled',
    timestamp: new Date().toISOString(),
  });
});

const PORT: number = config.port;
app.listen(PORT, () => {
  console.log(`Optimized API running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  redisClient.quit();
  process.exit(0);
});
