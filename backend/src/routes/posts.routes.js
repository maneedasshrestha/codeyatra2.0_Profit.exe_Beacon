import { Router } from "express";
import { createPost, getPosts, upvotePost, getFeed } from "../controllers/posts.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createPost);
router.get("/", getPosts);
router.get("/feed", getFeed);
router.post("/:id/upvote", requireAuth, upvotePost);

export default router;
