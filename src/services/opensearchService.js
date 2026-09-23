import client from '../config/opensearch.js';

export const indexLog = async (logData) => {
  await client.index({
    index: 'logs',
    body: logData,
  });
};

export const searchLogs = async ({ query, service, level }) => {
  const must = [];

  if (query) {
    must.push({ match: { message: query } });
  }
  if (service) {
    must.push({ term: { service } });
  }
  if (level) {
    must.push({ term: { level } });
  }

  const result = await client.search({
    index: 'logs',
    body: {
      query: {
        bool: { must },
      },
      sort: [{ timestamp: { order: 'desc' } }],
    },
  });

  return result.body.hits.hits.map((hit) => hit._source);
};