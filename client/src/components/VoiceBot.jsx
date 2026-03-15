import { useState } from "react"
import axios from "axios"

function VoiceBot(){

const [messages,setMessages] = useState([])

const recognition =window.webkitSpeechRecognition ? new window.webkitSpeechRecognition() : new window.SpeechRecognition()

recognition.lang = "en-US"

recognition.onresult = async (event)=>{

const text = event.results[0][0].transcript

console.log("🎤 User:",text)

setMessages(prev=>[...prev,{role:"user",text}])

const res = await axios.post("http://localhost:5000/api/chat",{
message:text
})

const reply = res.data.reply

console.log("🤖 Bot:",reply)

setMessages(prev=>[...prev,{role:"bot",text:reply}])

speak(reply)

}

function startListening(){

recognition.start()

}

function speak(text){

const speech = new SpeechSynthesisUtterance(text)

speech.onend = ()=>{
recognition.start()
}

window.speechSynthesis.speak(speech)

}

return(

<div className="p-6 bg-[#242424] shadow-lg rounded-xl w-[420px]">

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