import Groq from "groq-sdk"
import therapistPrompt from "../prompts/therapistPrompt.js"
import dotenv from "dotenv"
dotenv.config()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

let conversationHistory = [
  {
    role: "system",
    content: therapistPrompt
  }
]

export const getTherapistReply = async (userMessage) => {

  console.log("🗣 User:", userMessage)

  conversationHistory.push({
    role: "user",
    content: userMessage
  })

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: conversationHistory
  })

  const reply = completion.choices[0].message.content

  console.log("🤖 Therapist:", reply)

  conversationHistory.push({
    role: "assistant",
    content: reply
  })

  return reply
}