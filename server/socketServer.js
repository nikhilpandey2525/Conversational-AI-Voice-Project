import { WebSocketServer } from "ws"
import Groq from "groq-sdk"
import { ElevenLabsClient } from "elevenlabs"

const TTS_MODE = "browser" // change to "elevenlabs" for demo

const groq = new Groq({
 apiKey: process.env.GROQ_API_KEY
})

const elevenlabs = new ElevenLabsClient({
 apiKey: process.env.ELEVEN_API_KEY
})

export function startVoiceSocket(server){

const wss = new WebSocketServer({ server })

wss.on("connection",(ws)=>{

console.log("🔌 Voice client connected")

ws.on("message", async (message)=>{

try{

const data = JSON.parse(message)

if(data.type !== "user_message") return

const userText = data.text

console.log("🎤 User:", userText)

const stream = await groq.chat.completions.create({
 model: "llama-3.3-70b-versatile",
 messages:[
  {
   role:"system",
   content:"You are a calm empathetic therapist helping users talk about emotions."
  },
  {
   role:"user",
   content:userText
  }
 ],
 stream:true
})

let fullReply = ""

/* STREAM TOKENS */

for await (const chunk of stream){

const token = chunk.choices?.[0]?.delta?.content

if(!token) continue

fullReply += token

ws.send(JSON.stringify({
 type:"text_chunk",
 token
}))

}

/* FINAL RESPONSE */

ws.send(JSON.stringify({
 type:"final_text",
 text: fullReply
}))

console.log("🤖 Therapist:", fullReply)

/* ELEVENLABS ONLY IF ENABLED */

if(TTS_MODE === "elevenlabs"){

const audioStream = await elevenlabs.textToSpeech.convert(
 "pNInz6obpgDQGcFmaJgB",
 {
   text: fullReply,
   model_id:"eleven_turbo_v2",
   output_format:"mp3_44100_128"
 }
)

const chunks = []

for await (const chunk of audioStream){
 chunks.push(chunk)
}

const audioBuffer = Buffer.concat(chunks)

ws.send(JSON.stringify({
 type:"audio_chunk",
 audio: audioBuffer.toString("base64")
}))

}

}catch(error){

console.error("❌ Voice socket error:", error)

}

})

})

}