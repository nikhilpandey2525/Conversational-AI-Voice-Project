import { getTherapistReply } from "../services/llmservice.js"

export const chat = async (req, res) => {

  try {

    const { message } = req.body

    console.log("📩 Incoming message:", message)

    const reply = await getTherapistReply(message)

    res.json({ reply })

  } catch (error) {

    console.error("❌ Chat error:", error)

    res.status(500).json({ error: "Server error" })

  }

}