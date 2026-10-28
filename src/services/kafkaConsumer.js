
import kafka from '../config/kafka.js';
import { insertLog } from '../models/logModel.js';
import { indexLog } from './opensearchService.js';
import { getIO } from './socket.js';
import { checkAlerts } from './alertDetection.js';

const consumer = kafka.consumer({ groupId: 'logstream-group' });

export const connectConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'logs',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const logData = JSON.parse(message.value.toString());

      const {
        service,
        level,
        message: logMessage,
        timestamp,
      } = logData;

      // Save the log using Kafka's unique message identity.
      const savedLog = await insertLog(
        service,
        level,
        logMessage,
        timestamp,
        {
          topic,
          partition,
          offset: message.offset,
        }
      );

      if (savedLog) {
        // This Kafka message has not been inserted before.
        await indexLog({
          service,
          level,
          message: logMessage,
          timestamp,
        });

        console.log('Log saved and indexed:', {
          service,
          level,
          message: logMessage,
          timestamp,
        });

        // Notify connected dashboards.
        getIO().to('logs').emit('new-log', savedLog);
      } else {
        // PostgreSQL rejected a duplicate Kafka message.
        console.log(
          `Duplicate Kafka message skipped: ${topic}/${partition}/${message.offset}`
        );
      }

      // Still attempt alert detection if the log was already inserted.
      // This allows alert processing to retry after a previous failure.
      await checkAlerts({ service, level });
    },
  });

  console.log('Kafka consumer connected and listening');
};
