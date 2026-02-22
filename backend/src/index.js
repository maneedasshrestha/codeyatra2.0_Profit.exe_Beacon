import "dotenv/config";
import express from "express";
import authroutes from "./routes/user-auth.route.js";
import "dotenv/config";
import postsRouter from "./routes/posts.routes.js";
import marketplaceRouter from "./routes/marketplace.routes.js";
import { getFeed } from "./controllers/posts.controllers.js";

const app = express();
app.use(express.json());

app.use("/auth", authroutes);

app.use(express.json());

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "The server is running",
    sajan: "misses nistha",
  });
});

app.use("/api/posts", postsRouter);
app.use("/api/marketplace", marketplaceRouter);

// Shorthand feed endpoint: GET /feed?college=X&semester=Y
app.get("/feed", getFeed);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
