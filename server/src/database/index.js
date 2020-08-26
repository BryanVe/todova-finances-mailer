const mongoose = require("mongoose")
const URI = process.env.MONGO

mongoose
  .connect(URI, {
    // deprecation warnings
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to database!"))
  .catch((e) => {
    console.error("Connection error", e.message)
  })

module.exports = mongoose.connection
