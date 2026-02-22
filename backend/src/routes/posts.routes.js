import { Router } from "express";
import { createPost, getPosts, upvotePost } from "../controllers/posts.controllers.js";

const router = Router();

router.post("/", createPost);
router.get("/", getPosts);
router.post("/:id/upvote", upvotePost);

export default router;
