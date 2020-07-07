const { Schema, model, Types } = require("mongoose")

const customerSchema = new Schema(
  {
    _id: Types.ObjectId,
    details: {
      createdTime: Date,
      firstName: String,
      lastName: String,
      rut: String,
      email: String,
      phone: String,
      deviceType: String,
      birthDate: Date,
    },
    businessType: String,
    contactPerson: String,
    address: String,
  },
  {
    collection: "customer",
  }
)

module.exports = model("customer", customerSchema)
