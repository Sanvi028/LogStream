import express from 'express';
import { register, login } from '../controllers/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;