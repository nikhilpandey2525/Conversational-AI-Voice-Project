import { getTherapistReply } from "../services/llmService.js"
import { generateVoice } from "../services/voiceService.js"
import { detectEmotion } from "../utils/emotionDetector.js"
import { detectCrisis } from "../utils/safetyFilter.js"

export const chat = async (req,res)=>{

try{

const { message } = req.body

console.log("📩 User message:",message)

const crisis = detectCrisis(message)

let reply
let emotion

if(crisis){

console.log("⚠️ Crisis detected")

reply = `
I'm really sorry that you're feeling this much pain.
You don't have to go through this alone.

It might help to reach out to someone you trust or a mental health professional.
If you're in immediate danger, please contact a local crisis helpline.
`

emotion = "crisis"

}else{

emotion = detectEmotion(message)

console.log("💭 Detected emotion:",emotion)

reply = await getTherapistReply(message)

}

console.log("🤖 Therapist reply:",reply)

const audioBuffer = await generateVoice(reply)

const audioBase64 = Buffer.from(audioBuffer).toString("base64")

res.json({
reply,
emotion,
audio: audioBase64
})

}catch(error){

console.error("❌ Chat controller error:",error)

res.status(500).json({ error:"Server error" })

}

}