
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
    let response;

   for (let attempt = 1; attempt <= 3; attempt++) {
  try {
   const response = await ai.models.generateContent({
  
      model: "gemini-3.6-flash",
       contents: message,
    });
      break;
  } catch (error) {
    console.error(`Gemini attempt ${attempt} failed:`, error);

    if (attempt === 3) {
      throw error;
    }

    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  }
}
  //  console.timeEnd("Gemini response time");
  //   // const reply = response.text();
  //   const reply = response?.text || "Sorry, I couldn't generate a response.";

  //   console.log("AI response:", reply);

  //   res.json({
  //     reply,
  //   });
  console.timeEnd("Gemini response time");


  if (!response) {
  throw new Error("Gemini returned no response");
}

console.log("Gemini raw response:", JSON.stringify(response));

const reply = response.text;

if (!reply) {
  throw new Error("Gemini returned no text");
}

console.log("AI response:", reply);

res.json({
  reply,
});

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