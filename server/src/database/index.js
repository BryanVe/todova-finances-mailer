const mongoose = require("mongoose")

const URI = process.env.MONGO

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database!"))
  .catch((e) => {
    console.error("Connection error", e.message)
  })

const database = mongoose.connection

module.exports = database
