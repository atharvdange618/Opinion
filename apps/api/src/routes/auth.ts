import { Router } from 'express';

import { getMeHandler, syncUserHandler } from '../controllers/auth.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/sync', requireAuth, syncUserHandler);
router.get('/me', requireAuth, getMeHandler);

export default router;
