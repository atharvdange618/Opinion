import { createPollSchema, updatePollSchema } from '@opinion/shared';
import { Router } from 'express';

import {
  createPoll,
  deletePoll,
  getAnalytics,
  getMyPolls,
  getPoll,
  publishPoll,
  updatePoll,
} from '../controllers/polls.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(requireAuth);

router.get('/', getMyPolls);
router.post('/', validate(createPollSchema), createPoll);
router.get('/:id', getPoll);
router.put('/:id', validate(updatePollSchema), updatePoll);
router.delete('/:id', deletePoll);
router.put('/:id/publish', publishPoll);
router.get('/:id/analytics', getAnalytics);

export default router;
