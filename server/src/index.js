const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const fs = require("fs")

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
  app.post("/configuration/database/sync", databaseController.sync(socket))
  app.post(
    "/finances/generate/pdf-files",
    async (req, res) => await pdfFilesController.generateFiles(socket, req, res)
  )
  app.get(
    "/finances/get/pdf-files",
    async (req, res) => await pdfFilesController.getFiles(socket, req, res)
  )

  // app.get("/pdfs", (req, res) => {
  //   res.header("Content-Type", "application/pdf")
  //   res.attachment("aedasdasdad.pdf")
  //   res.download(path.join(__dirname, "pdfs/prueba1.pdf"))
  // })
})

// start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
