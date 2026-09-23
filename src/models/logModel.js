import pool from '../config/db.js';

export const insertLog = async (service, level, message, timestamp) => {
  const result = await pool.query(
    `INSERT INTO logs (service, level, message, timestamp) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [service, level, message, timestamp]
  );
  return result.rows[0];
};