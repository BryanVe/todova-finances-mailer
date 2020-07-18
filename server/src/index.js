const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

const http = require("http")
const server = http.createServer(app)
const socketIO = require("socket.io")
const io = socketIO(server)
const { spawn } = require("child_process")
const path = require("path")

const db = require("./database")
const routes = require("./routes")

const PORT = 4000 || process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on("error", console.error.bind(console, "MongoDB connection error:"))

// routes represent all our http routes
app.use(routes)

// endpoint just to know that server is running
app.get("/", (req, res) => {
  res.json({ status: "express is running" })
})

// this section will manage the broadcast of the server console to the client
io.on("connection", (socket) => {
  app.post("/", (req, res) => {
    res.end()
    const execFolder = path.resolve(__dirname, "assets/bash/mongo-sync")
    const execFile = "mongo-sync.sh"
    const cmd = `${execFolder}/${execFile}`

    const exec = spawn("bash", [cmd, "pull"], { cwd: execFolder })

    // broadcasts bash file execution
    exec.stdout.on("data", (data) => {
      socket.broadcast.emit("database-log", data + "")
    })

    // broadcasts error if it occurs
    exec.stderr.on("data", (data) => {
      socket.broadcast.emit("database-log", data + "")
    })

    // code 0 === success
    exec.on("close", (code) => {
      socket.broadcast.emit("database-sync", code === 0)
    })
  })
})

// start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
