import express from "express";
import authroutes from "./routes/user-auth.route.js";
import "dotenv/config";

const app = express();
app.use(express.json());

app.use("/auth", authroutes);

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "The server is running",
    sajan: "misses nistha",
  });
});
app.listen(process.env.PORT || 3000);
