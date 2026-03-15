const crisisWords = [

"suicide",
"kill myself",
"want to die",
"end my life",
"take my life",
"no reason to live",
"life is not worth living",
"self harm",
"hurt myself",
"cut myself",
"overdose",
"jump off",
"hanging myself",
"can't live anymore",
"i want to disappear",
"better off dead",
"i should die",
"i wish i was dead",
"thinking about suicide",
"planning suicide"

]

export const detectCrisis = (message) => {

const text = message.toLowerCase()

for(const word of crisisWords){

if(text.includes(word)){
return true
}

}

return false

}