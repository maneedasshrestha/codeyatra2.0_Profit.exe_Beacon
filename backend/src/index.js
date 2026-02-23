import "dotenv/config";
import express from "express";
import authroutes from "./routes/user-auth.route.js";
import postsRouter from "./routes/posts.routes.js";
import marketplaceRouter from "./routes/marketplace.routes.js";
import resourceRouter from "./routes/resource.routes.js";
import commentsRouter from "./routes/comments.routes.js";
import { getFeed } from "./controllers/posts.controllers.js";
import cors from "cors";

const app = express();
app.use(express.json());
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/auth", authroutes);

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "The server is running",
    sajan: "misses nistha",
  });
});

app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/marketplace", marketplaceRouter);
app.use("/api/resources", resourceRouter);

// Shorthand feed endpoint: GET /feed?college=X&semester=Y
app.get("/feed", getFeed);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
