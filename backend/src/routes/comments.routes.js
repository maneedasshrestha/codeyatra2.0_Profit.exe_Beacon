import { Router } from "express";
import {
  createComment,
  getComments,
  deleteComment,
} from "../controllers/comments.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/comments/:postId — fetch comments for a post
router.get("/:postId", getComments);

// POST /api/comments/:postId — create a comment (auth required)
router.post("/:postId", requireAuth, createComment);

// DELETE /api/comments/:commentId — delete own comment (auth required)
router.delete("/:commentId", requireAuth, deleteComment);

export default router;
