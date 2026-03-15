import { useState, useRef, useEffect } from "react"
import axios from "axios"

function VoiceBot(){

const [messages,setMessages] = useState([])
const recognitionRef = useRef(null)

function playAudio(base64Audio){

if(!base64Audio){
console.error("❌ No audio received")
return
}

const audioSrc = `data:audio/mp3;base64,${base64Audio}`

const audio = new Audio(audioSrc)

console.log("🔊 Playing therapist voice")

audio.play()

audio.onended = ()=>{
recognitionRef.current?.start()
}

}

useEffect(()=>{

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition

if(!SpeechRecognition){
console.error("Speech Recognition not supported")
return
}

const recognition = new SpeechRecognition()

recognition.lang = "en-US"
recognition.continuous = false

recognition.onresult = async (event)=>{

const text = event.results[0][0].transcript

console.log("🎤 User:",text)

setMessages(prev=>[...prev,{role:"user",text}])

try{

const res = await axios.post(
"http://localhost:5000/api/chat",
{ message:text }
)

const reply = res.data.reply
const emotion = res.data.emotion
const audioBase64 = res.data.audio

console.log("💭 Emotion:",emotion)
console.log("🤖 Bot:",reply)

setMessages(prev=>[...prev,{role:"bot",text:reply}])

if(audioBase64){
playAudio(audioBase64)
}else{
console.error("❌ No audio returned from server")
}

}catch(error){

console.error("❌ API error:",error)

}

}

recognitionRef.current = recognition

},[])

function startListening(){

console.log("🎧 Listening...")

recognitionRef.current?.start()

}

return(

<div className="p-6 bg-[#242424] shadow-lg rounded-xl w-100 text-white">

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

{messages.map((msg,i)=>(

<div key={i}>

<strong>
{msg.role==="user"?"You: ":"Therapist: "}
</strong>

{msg.text}

</div>

))}

</div>

</div>

)

}

export default VoiceBot