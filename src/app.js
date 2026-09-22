import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ dbTime: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// error handler must be added LAST, after all routes
app.use(errorHandler);

export default app;