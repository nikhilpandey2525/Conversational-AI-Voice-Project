import { generateVoice } from "./services/voiceService.js"

async function test(){
  const audio = await generateVoice("Hello Sarvesh, this is a test voice.")
  console.log("Audio size:", audio.length)
}

test()