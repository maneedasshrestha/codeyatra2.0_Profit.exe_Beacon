import "dotenv/config";
import express from "express";
import authroutes from "./routes/user-auth.route.js";
import postsRouter from "./routes/posts.routes.js";
import marketplaceRouter from "./routes/marketplace.routes.js";
import resourceRouter from "./routes/resource.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import { getFeed } from "./controllers/posts.controllers.js";
import cors from "cors";

const app = express();
app.use(express.json());

// List of allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3000/",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.indexOf(origin + "/") !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use("/api/marketplace", marketplaceRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/ai", aiRoutes);

// Shorthand feed endpoint: GET /feed?college=X&semester=Y
app.get("/feed", getFeed);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
