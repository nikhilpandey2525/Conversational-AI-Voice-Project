import { ElevenLabsClient } from "elevenlabs"
import dotenv from "dotenv"
dotenv.config()

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_API_KEY
})
console.log("Eleven API key loaded:", !!process.env.ELEVEN_API_KEY)

export const generateVoice = async (text) => {

  console.log("🔊 Generating ElevenLabs voice")

  const audioStream = await elevenlabs.textToSpeech.convert(
    "pNInz6obpgDQGcFmaJgB", // Rachel voice
    {
      text: text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128",
      voice_settings: {
      stability: 0.6,
      similarity_boost: 0.8
     }
    }
  )
  
  const chunks = []

  for await (const chunk of audioStream) {
    chunks.push(chunk)
  }

  return Buffer.concat(chunks)
}