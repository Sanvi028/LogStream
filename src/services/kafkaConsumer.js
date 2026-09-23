import kafka from '../config/kafka.js';
import { insertLog } from '../models/logModel.js';
import { indexLog } from './opensearchService.js';

const consumer = kafka.consumer({ groupId: 'logstream-group' });

export const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'logs', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const logData = JSON.parse(message.value.toString());
      const { service, level, message: logMessage, timestamp } = logData;

      await insertLog(service, level, logMessage, timestamp);
      await indexLog({ service, level, message: logMessage, timestamp });

      console.log('Log saved and indexed:', logData);
    },
  });

  console.log('Kafka consumer connected and listening');
};