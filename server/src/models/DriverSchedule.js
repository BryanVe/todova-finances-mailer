const { Schema, model, Types } = require("mongoose")

const driverScheduleSchema = new Schema(
  {
    _id: Types.ObjectId,
    driverId: String,
    startTime: Date,
    endTime: Date,
    minDriverPay: Number,
    createdTime: Date,
  },
  {
    collection: "driverSchedule",
  }
)

module.exports = model("driverSchedule", driverScheduleSchema)
