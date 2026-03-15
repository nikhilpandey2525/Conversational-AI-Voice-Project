import { ElevenLabsClient } from "elevenlabs"
import dotenv from "dotenv"

dotenv.config()

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_API_KEY
})

async function listVoices(){

const voices = await elevenlabs.voices.getAll()

voices.voices.forEach(v => {

console.log("Name:", v.name)
console.log("Voice ID:", v.voice_id)
console.log("Category:", v.category)
console.log("----")

})

}

listVoices()