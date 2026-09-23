import { Kafka } from 'kafkajs';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({
  clientId: 'logstream',
  brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
  ssl: {
    ca: [fs.readFileSync('./certs/ca.pem', 'utf-8')],
  },
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
});

export default kafka;