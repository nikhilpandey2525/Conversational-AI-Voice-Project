import { useState, useRef, useEffect } from "react"

const TTS_MODE = "browser" // change to "elevenlabs" for final demo

function VoiceBot(){

const [currentMessage,setCurrentMessage] = useState("")
const [status,setStatus] = useState("Idle")
const [isActive,setIsActive] = useState(false)

const recognitionRef = useRef(null)
const socketRef = useRef(null)

/* ---------- INTERRUPT BOT SPEECH ---------- */

function interruptBotSpeech(){

speechSynthesis.cancel()

}

/* ---------- BROWSER SPEECH ---------- */

function speakBrowser(text){

speechSynthesis.cancel()

setStatus("Speaking")

const speech = new SpeechSynthesisUtterance(text)

speech.rate = 0.95
speech.pitch = 1

console.log("🔊 Browser speaking")

speechSynthesis.speak(speech)

speech.onend = ()=>{
if(isActive){
startListening()
}
}

}

/* ---------- ELEVENLABS AUDIO ---------- */

function playElevenLabs(base64Audio){

setStatus("Speaking")

const audioSrc = `data:audio/mp3;base64,${base64Audio}`

const audio = new Audio(audioSrc)

audio.play()

audio.onended = ()=>{
if(isActive){
startListening()
}
}

}

/* ---------- START LISTENING ---------- */

function startListening(){

if(!recognitionRef.current || !isActive) return

console.log("🎧 Listening...")

setStatus("Listening")

recognitionRef.current.start()

}

/* ---------- STOP CONVERSATION ---------- */

function stopConversation(){

console.log("🛑 Conversation stopped")

setIsActive(false)

speechSynthesis.cancel()

if(recognitionRef.current){
recognitionRef.current.stop()
}

setCurrentMessage("")
setStatus("Idle")

}

/* ---------- START CONVERSATION ---------- */

function startConversation(){

console.log("▶️ Conversation started")

setIsActive(true)

startListening()

}

/* ---------- INITIALIZATION ---------- */

useEffect(()=>{

/* ---------- WEBSOCKET ---------- */

socketRef.current = new WebSocket("ws://localhost:5000")

socketRef.current.onopen = ()=>{
console.log("🔌 Voice server connected")
}

socketRef.current.onmessage = (event)=>{

const data = JSON.parse(event.data)

console.log("📨 Socket message:",data.type)

/* Browser speech mode */

if(TTS_MODE === "browser" && data.type === "final_text"){

setCurrentMessage(`Therapist: ${data.text}`)

speakBrowser(data.text)

}

/* ElevenLabs mode */

if(TTS_MODE === "elevenlabs" && data.type === "audio_chunk"){

playElevenLabs(data.audio)

}

}

/* ---------- SPEECH RECOGNITION ---------- */

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition

if(!SpeechRecognition){
console.error("Speech recognition not supported")
return
}

const recognition = new SpeechRecognition()

recognition.lang = "en-US"
recognition.continuous = false
recognition.interimResults = false

recognition.onresult = (event)=>{

const text = event.results[0][0].transcript

console.log("🎤 User:",text)

interruptBotSpeech()

setCurrentMessage(`You: ${text}`)

socketRef.current.send(JSON.stringify({
type:"user_message",
text:text
}))

}

/* Restart listening automatically */

recognition.onend = ()=>{
if(isActive){
startListening()
}
}

recognitionRef.current = recognition

},[isActive])

/* ---------- UI ---------- */

return(

<div className="p-6 bg-[#242424] shadow-lg rounded-xl w-400 text-white">

<h1 className="text-xl font-bold mb-4">
AI Therapist Voice Bot
</h1>

<div className="flex gap-3 mb-4">

<button
onClick={startConversation}
className="bg-green-500 px-4 py-2 rounded"
>
Start
</button>

<button
onClick={stopConversation}
className="bg-red-500 px-4 py-2 rounded"
>
Stop
</button>

</div>

<p className="text-sm text-gray-400 mb-4">
Start the bot and speak naturally. You can interrupt anytime.
</p>

{/* Status Indicator */}

<div className="mb-4 text-sm">

Status: 
<span className={
status === "Listening"
? "text-green-400 ml-2"
: status === "Speaking"
? "text-blue-400 ml-2"
: "text-gray-400 ml-2"
}>
{status}
</span>

</div>

{/* Live Message */}

<div className="mt-6 text-lg">

{currentMessage}

</div>

</div>

)

}

export default VoiceBot