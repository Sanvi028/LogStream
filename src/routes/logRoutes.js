
import express from 'express';
import {
  ingestLog,
  getLogs,
  getAnalytics,
} from '../controllers/logController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/ingest', verifyToken, ingestLog);
router.get('/search', verifyToken, getLogs);
router.get('/analytics', verifyToken, getAnalytics);

export default router;
