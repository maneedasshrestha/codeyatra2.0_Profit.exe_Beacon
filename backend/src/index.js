import express from "express";

const app = express();

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "The server is running",
    sajan: "misses nistha",
  });
});
app.listen(process.env.PORT || 3000);
