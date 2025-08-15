import express, { Request, Response } from 'express';

// Define a type for our user data
interface User {
  id: number;
  name: string;
}

const app = express();

// Simulate a database connection
const DB = (): Promise<User> =>
  new Promise<User>((res) =>
    setTimeout(() => {
      console.log('Database connected');
      res({ id: 1, name: 'ksusha' });
    }, 1000)
  );

app.get('/user', async (req: Request, res: Response) => {
  try {
    const user = await DB();
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Server is running onLocal: http://localhost:${PORT}`);
});
