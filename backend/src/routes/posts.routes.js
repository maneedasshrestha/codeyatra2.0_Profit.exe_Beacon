import { Router } from "express";
import {
  createPost,
  getPosts,
  upvotePost,
  getFeed,
  getPostById,
} from "../controllers/posts.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createPost);
router.get("/", getPosts);
router.get("/feed", requireAuth, getFeed);
router.get("/:id", getPostById);
router.post("/:id/upvote", requireAuth, upvotePost);

export default router;
