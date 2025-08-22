import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = parseInt(process.env.PORT || '3002');

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

interface User {
  id: number;
  name: string;
}

const fakeDB = (): Promise<User> => {
  return new Promise<User>((resolve) => {
    const delay = Math.random() * 50 + 50;
    setTimeout(() => {
      resolve({ id: 1, name: 'Ksusha' });
    }, delay);
  });
};

app.get('/user', async (req: Request, res: Response) => {
  try {
    const data = await fakeDB();
    res.json(data);
  } catch (error) {
    console.error('Basic API: Error fetching user:', error);
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
      message: 'Heavy CPU work completed',
      processingTime: `${processingTime}ms`,
      result: Math.round(result),
      matrixSize: matrix.length,
      worker: 'Single Process',
      api: 'Basic (No Cache)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in CPU-intensive operation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK - Basic (No Cache)',
    version: 'No optimization',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Basic API running on http://localhost:${PORT}`);
});
