const emotionKeywords = {

sadness: [
"sad",
"unhappy",
"depressed",
"down",
"miserable",
"heartbroken",
"cry",
"crying",
"hopeless",
"empty"
],

anxiety: [
"anxious",
"worried",
"panic",
"panic attack",
"nervous",
"stressed",
"overthinking",
"restless",
"fearful"
],

anger: [
"angry",
"mad",
"furious",
"frustrated",
"annoyed",
"irritated",
"rage"
],

burnout: [
"burnt out",
"burned out",
"exhausted",
"overwhelmed",
"drained",
"mentally tired",
"too much pressure"
],

loneliness: [
"lonely",
"alone",
"isolated",
"no friends",
"no one understands",
"no one cares"
],

fear: [
"scared",
"afraid",
"terrified",
"fear",
"worried about future"
],

hopelessness: [
"hopeless",
"no hope",
"nothing will change",
"what's the point",
"life is pointless",
"giving up"
]

}

export const detectEmotion = (message) => {

const text = message.toLowerCase()

for(const emotion in emotionKeywords){

for(const word of emotionKeywords[emotion]){

if(text.includes(word)){
return emotion
}

}

}

return "neutral"

}