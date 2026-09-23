import client from '../config/opensearch.js';

const createIndex = async () => {
  const indexExists = await client.indices.exists({ index: 'logs' });

  if (indexExists.body) {
    console.log('Index already exists');
    return;
  }

  await client.indices.create({
    index: 'logs',
    body: {
      mappings: {
        properties: {
          service: { type: 'keyword' },
          level: { type: 'keyword' },
          message: { type: 'text' },
          timestamp: { type: 'date' },
        },
      },
    },
  });

  console.log('Logs index created');
};

createIndex();