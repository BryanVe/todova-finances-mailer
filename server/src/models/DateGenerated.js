const { Schema, model } = require("mongoose")

const dateGeneratedSchema = new Schema(
  {
    beginDate: Date,
    endDate: Date,
    payDate: Date,
  },
  {
    collection: "dateGenerated",
  }
)

module.exports = model("dateGenerated", dateGeneratedSchema)
