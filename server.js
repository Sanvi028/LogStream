import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './src/app.js';
import { initSocket } from './src/services/socket.js';
import { connectProducer } from './src/services/kafkaProducer.js';
import { connectConsumer } from './src/services/kafkaConsumer.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectProducer();
connectConsumer();