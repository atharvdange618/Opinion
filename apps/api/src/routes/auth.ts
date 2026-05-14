import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { syncUserHandler, getMeHandler } from '../controllers/auth.js';

const router = Router();

router.post('/sync', requireAuth, syncUserHandler);
router.get('/me', requireAuth, getMeHandler);

export default router;
