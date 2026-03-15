/* eslint-disable no-unused-vars */
import { useState } from "react"
import axios from "axios"

function VoiceBot() {

  const [messages, setMessages] = useState([])
  const [listening, setListening] = useState(false)
  const recognition = window.SpeechRecognition
    ? new window.SpeechRecognition()
    : new window.webkitSpeechRecognition()

  recognition.lang = "en-US"
  recognition.continuous = false

  recognition.onresult = async (event) => {

    const text = event.results[0][0].transcript
    console.log("🎤 Voice captured:", text)

    setMessages(prev => [...prev, { role: "user", text }])

    try {
      console.log("📡 Sending request to backend...")
      const res = await axios.post("http://localhost:5000/chat", {
        message: text
      })
      console.log("📥 Response received:", res.data)
      const reply = res.data.reply

      setMessages(prev => [...prev, { role: "bot", text: reply }])

      speak(reply)

    } catch (error) {
      console.error("❌ API error:", error)
    }
  }

  function startListening() {

    setListening(true)
    recognition.start()

  }

  function speak(text) {
    console.log("🔊 Bot speaking:", text)
    const speech = new SpeechSynthesisUtterance(text)

    speech.lang = "en-US"

    speech.onend = () => {
      console.log("🎧 Listening again...")
      recognition.start()
    }

    window.speechSynthesis.speak(speech)

  }

  return (

    <div className="bg-white p-6 rounded-xl shadow-lg w-100">

      <h1 className="text-xl font-bold mb-4">
        AI Therapist Voice Bot
      </h1>

      <button
        onClick={startListening}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        🎤 Start Talking
      </button>

      <div className="mt-6 space-y-2">

        {messages.map((msg, index) => (

          <div key={index}>

            <span className="font-semibold">
              {msg.role === "user" ? "You: " : "Therapist: "}
            </span>

            {msg.text}

          </div>

        ))}

      </div>

    </div>

  )
}

export default VoiceBot