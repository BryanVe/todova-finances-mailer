const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()

const db = require("./database")
const PORT = 4000 || process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on("error", console.error.bind(console, "MongoDB connection error:"))

app.get("/", (req, res) => {
  res.json({ status: "express is running" })
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
