import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { optionalAuth } from "../middleware/auth.js";
import { submitResponseSchema } from "@opinion/shared";
import {
  getPublicPoll,
  getPublicResults,
  submitResponse,
} from "../controllers/public.js";

const router = Router();

router.get("/:slug", getPublicPoll);
router.get("/:slug/results", getPublicResults);
router.post("/:slug/respond", optionalAuth, validate(submitResponseSchema), submitResponse);

export default router;
