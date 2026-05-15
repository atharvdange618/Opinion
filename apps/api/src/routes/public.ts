import { submitResponseSchema } from '@opinion/shared';
import { Router } from 'express';

import {
  createPollVerification,
  getPollVerificationStatus,
  getPublicPoll,
  getPublicResults,
  submitResponse,
} from '../controllers/public.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/:slug', getPublicPoll);
router.get('/:slug/results', getPublicResults);
router.post('/:slug/respond', optionalAuth, validate(submitResponseSchema), submitResponse);
router.post('/:slug/verify', createPollVerification);
router.get('/:slug/verify/status', getPollVerificationStatus);

export default router;
