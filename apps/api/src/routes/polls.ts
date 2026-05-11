import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createPollSchema, updatePollSchema } from "@opinion/shared";
import {
  createPoll,
  getMyPolls,
  getPoll,
  updatePoll,
  deletePoll,
  publishPoll,
  getAnalytics,
} from "../controllers/polls.js";

const router = Router();

router.use(requireAuth);

router.get("/", getMyPolls);
router.post("/", validate(createPollSchema), createPoll);
router.get("/:id", getPoll);
router.put("/:id", validate(updatePollSchema), updatePoll);
router.delete("/:id", deletePoll);
router.put("/:id/publish", publishPoll);
router.get("/:id/analytics", getAnalytics);

export default router;
