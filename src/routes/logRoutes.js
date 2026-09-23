import express from 'express';
import { ingestLog } from '../controllers/logController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/ingest', verifyToken, ingestLog);

export default router;