const { Schema, model, Types } = require("mongoose")

const driverInfoSchema = new Schema(
  {
    email: String,
    totalPay: Number,
    isEmailSended: Boolean,
  },
  {
    collection: "driverInfo",
  }
)

module.exports = model("driverInfo", driverInfoSchema)
