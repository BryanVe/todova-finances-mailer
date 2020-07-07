const { Schema, model, Types } = require("mongoose")

const enterpriseSchema = new Schema(
  {
    _id: Types.ObjectId,
    createdTime: Date,
    company: {
      name: String,
      rut: String,
      giro: String,
      addressInfo: {
        direction: String,
      },
    },
    userManagement: Array,
  },
  {
    collection: "enterprise",
  }
)

module.exports = model("enterprise", enterpriseSchema)
