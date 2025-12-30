import express from "express";
import cors from "cors";
import predictRouter from "./routes/predict.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/predict", predictRouter);

app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
