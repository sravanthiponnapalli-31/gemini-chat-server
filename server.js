
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    
    console.log("User message:", message);
      console.time("Gemini response time");

const response = await ai.models.generateContent({
  
      model: "gemini-3.6-flash",
       contents: message,
    });
   console.timeEnd("Gemini response time");
    const reply = response.text;

    console.log("AI response:", reply);

    res.json({
      reply,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    res.status(500).json({
      error: "Failed to get AI response",
    });
  }
});

// app.listen(3001, () => {
//   console.log("Gemini AI server running on http://localhost:3001");
// });
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Gemini AI server running on port ${PORT}`);
});