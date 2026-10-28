import pool from '../config/db.js';

export const insertLog = async (
  service,
  level,
  message,
  timestamp,
  { topic, partition, offset }
) => {
  const result = await pool.query(
    `INSERT INTO public.logs (
       service,
       level,
       message,
       timestamp,
       kafka_topic,
       kafka_partition,
       kafka_offset
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (kafka_topic, kafka_partition, kafka_offset)
     DO NOTHING
     RETURNING *`,
    [
      service,
      level,
      message,
      timestamp,
      topic,
      partition,
      offset
    ]
  );

  // No returned row means this Kafka message was already inserted.
  return result.rows[0] ?? null;
};