import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import prompt from "./prompts/prompt.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("🗣 User message:", message);
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    console.log("🤖 AI reply:", reply);
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "LLM Error" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});
