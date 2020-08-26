const { Schema, model } = require("mongoose")

const notSentFileSchema = new Schema(
  {
    file: String,
  },
  {
    collection: "notSentFile",
  }
)

module.exports = model("notSentFile", notSentFileSchema)
