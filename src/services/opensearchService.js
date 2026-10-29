import client from '../config/opensearch.js';

export const indexLog = async (logData) => {
  await client.index({
    index: 'logs',
    body: logData,
    refresh: true,
  });
};

export const searchLogs = async ({ query, service, level }) => {
  const must = [];
  const filter = [];

  const searchTerm = query?.trim();

  if (searchTerm) {
    must.push({
      query_string: {
        query: `*${searchTerm.replace(/[+\-=!(){}\[\]^"~*?:\\/]/g, '\\$&')}*`,
        fields: ['message'],
        analyze_wildcard: true,
        allow_leading_wildcard: true,
        default_operator: 'AND',
      },
    });
  }

  if (service) {
    filter.push({
      term: {
        service: service,
      },
    });
  }

  if (level) {
    filter.push({
      term: {
        level: level,
      },
    });
  }

  const result = await client.search({
    index: 'logs',
    body: {
      size: 1000,
      query: {
        bool: {
          must,
          filter,
        },
      },
      sort: [
        {
          timestamp: {
            order: 'desc',
            unmapped_type: 'date',
          },
        },
      ],
    },
  });

  return result.body.hits.hits.map((hit) => ({
    ...hit._source,
    id: hit._id,
  }));
};

export const getLogAnalytics = async () => {
  const now = new Date();
  const last24Hours = new Date(
    now.getTime() - 24 * 60 * 60 * 1000
  );

  try {
    const result = await client.search({
      index: 'logs',
      body: {
        size: 0,
        query: {
          range: {
            timestamp: {
              gte: last24Hours.toISOString(),
              lte: now.toISOString(),
            },
          },
        },
        aggs: {
          by_level: {
            terms: {
              field: 'level',
              size: 10,
            },
          },
          logs_over_time: {
            date_histogram: {
              field: 'timestamp',
              fixed_interval: '1h',
              min_doc_count: 0,
              extended_bounds: {
                min: last24Hours.toISOString(),
                max: now.toISOString(),
              },
            },
          },
        },
      },
    });

    const aggregations = result.body.aggregations;

    if (!aggregations) {
      throw new Error(
        'OpenSearch returned no analytics aggregations.'
      );
    }

    const buckets = aggregations.by_level.buckets;
    const timeBuckets = aggregations.logs_over_time.buckets;

    const counts = {
      ERROR: 0,
      WARN: 0,
      INFO: 0,
      DEBUG: 0,
    };

    for (const bucket of buckets) {
      const level = String(bucket.key).toUpperCase();

      if (Object.hasOwn(counts, level)) {
        counts[level] = bucket.doc_count;
      }
    }

    return {
      totalLogs: buckets.reduce(
        (total, bucket) => total + bucket.doc_count,
        0
      ),
      errors: counts.ERROR,
      warnings: counts.WARN,
      info: counts.INFO,
      logsOverTime: timeBuckets.map((bucket) => ({
        time: new Date(bucket.key).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        count: bucket.doc_count,
      })),
    };
  } catch (err) {
    console.error(
      'OpenSearch analytics error:',
      err.meta?.body ?? err.message
    );

    throw err;
  }
};
