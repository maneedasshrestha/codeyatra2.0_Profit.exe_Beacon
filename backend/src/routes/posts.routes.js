import { Router } from "express";
import { createPost, getPosts, upvotePost, getFeed } from "../controllers/posts.controllers.js";

const router = Router();

router.post("/", createPost);
router.get("/", getPosts);
router.get("/feed", getFeed);
router.post("/:id/upvote", upvotePost);

export default router;
