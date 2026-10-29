
import { sendLog } from '../services/kafkaProducer.js';
import {
  searchLogs,
  getLogAnalytics,
} from '../services/opensearchService.js';

export const ingestLog = async (req, res, next) => {
  try {
    const { service, level, message } = req.body;

    if (!service || !level || !message) {
      return res.status(400).json({
        error: 'service, level, and message are required',
      });
    }

    const logData = {
      service,
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    await sendLog(logData);

    res.status(202).json({
      status: 'Log accepted',
      log: logData,
    });
  } catch (err) {
    next(err);
  }
};

export const getLogs = async (req, res, next) => {
  try {
    const { query, service, level } = req.query;
    const logs = await searchLogs({ query, service, level });

    res.json({ logs });
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await getLogAnalytics();
    res.json(analytics);
  } catch (err) {
    next(err);
  }
};
