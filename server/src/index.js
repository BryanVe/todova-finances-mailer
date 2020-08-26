const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const app = express()

const http = require("http")
const server = http.createServer(app)
const socketIO = require("socket.io")
const io = socketIO(server)

const db = require("./database")
const routes = require("./routes")
const databaseController = require("./controllers/configuration/database")
const pdfFilesController = require("./controllers/finances/pdfFiles")

const PORT = 4000 || process.env.PORT

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
)

db.on("error", console.error.bind(console, "MongoDB connection error:"))

// routes represent all our http routes
app.use(routes)

app.use("/images", express.static(path.join(__dirname, "assets/images")))

// endpoint just to know that server is running
app.get("/", (req, res) => {
  res.json({ status: "success", message: "express is running" })
})

io.on("connection", (socket) => {
  app.post("/configuration/database/sync", (req, res) =>
    databaseController.sync(socket, req, res)
  )
  app.post(
    "/finances/pdf-files/generate",
    async (req, res) => await pdfFilesController.generateFiles(socket, req, res)
  )
})

// start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
