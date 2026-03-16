import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import http from "http"

import chatRoutes from "./routes/chatRoutes.js"
import { startVoiceSocket } from "./socketServer.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", chatRoutes)

/*
Create HTTP server manually
so WebSockets can attach to it
*/
const server = http.createServer(app)

/*
Start WebSocket voice server
*/
startVoiceSocket(server)

/*
Start HTTP + WS server
*/
server.listen(5000, () => {
  console.log("🚀 Server running on port 5000")
})