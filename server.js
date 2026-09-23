import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectProducer } from './src/services/kafkaProducer.js';
import { connectConsumer } from './src/services/kafkaConsumer.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// after app.listen(...), or before it — add this line
connectProducer();
connectConsumer();
