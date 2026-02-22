import "dotenv/config";
import express from "express";
import postsRouter from "./routes/posts.routes.js";
import { getFeed } from "./controllers/posts.controllers.js";

const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "The server is running",
    sajan: "misses nistha",
  });
});

app.use("/api/posts", postsRouter);

// Shorthand feed endpoint: GET /feed?college=X&semester=Y
app.get("/feed", getFeed);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
