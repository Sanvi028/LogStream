import kafka from '../config/kafka.js';

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka producer connected');
};

export const sendLog = async (logData) => {
  await producer.send({
    topic: 'logs',
    messages: [
      { value: JSON.stringify(logData) }
    ],
  });
};