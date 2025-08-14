import express, { Request, Response } from 'express';

import { createClient } from 'redis';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

// Define a type for our user data
interface User {
  id: number;
  name: string;
}

const app = express();

// Create Redis client
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Configure rate limiting
const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limiting each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Apply rate limiting to all requests
app.use(limiter);

// Simulate a database connection
const fakeDB = (): Promise<User> =>
  new Promise<User>((res) =>
    setTimeout(() => {
      console.log('Fetching from DB');
      res({ id: 1, name: 'ksusha' });
    }, 1000)
  );

app.get('/user', async (req: Request, res: Response) => {
  try {
    const cacheKey = 'user:1';
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log('Returning from cache');
      res.set('Cache-Control', 'public, max-age=60');
      return res.json(JSON.parse(cached));
    }

    const data = await fakeDB();
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 });
    res.json(data);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
