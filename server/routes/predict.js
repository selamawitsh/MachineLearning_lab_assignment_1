import express from "express";
import fetch from "node-fetch";

const router = express.Router();
const ML_URL = "http://localhost:8000";

router.post("/:model", async (req, res) => {
  const { model } = req.params;

  if (!["logistic", "tree"].includes(model)) {
    return res.status(400).json({ error: "Unknown model" });
  }

  try {
    const response = await fetch(`${ML_URL}/predict/${model}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "ML service unreachable" });
  }
});

export default router;
