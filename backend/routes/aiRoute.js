import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            {
              text: `You are an expert in agriculture. Answer the following question in a helpful way:\n\n${question}`
            }
          ]
        }
      ]
    });

    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) {
      return res.status(500).json({ error: "Failed to get a valid response from Gemini API" });
    }

    res.json({ answer });
  } catch (err) {
    console.error("Gemini API Error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
