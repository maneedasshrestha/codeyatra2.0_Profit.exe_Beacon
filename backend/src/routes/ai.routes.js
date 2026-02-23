import { Router } from "express";
import { getAiChatResponse } from "../controllers/ai.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// For now, we'll allow chat without auth for easier integration/testing
router.post("/chat", getAiChatResponse);

export default router;
