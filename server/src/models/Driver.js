const { Schema, model, Types } = require("mongoose")

const driverSchema = new Schema(
  {
    _id: Types.ObjectId,
    details: {
      createdTime: Date,
      firstName: String,
      lastName: String,
      rut: String,
      email: String,
      phone: String,
      profileImage: String,
    },
    bankDetails: {
      bankName: String,
      accountType: String,
      accountNumber: String,
      receiverName: String,
      receiverRut: String,
    },
    subscribedDeliveries: {
      walk: {
        isActiveOnDeliveryType: Boolean,
        driverStatusDictionaryCode: String,
      },
      bicycle: {
        isActiveOnDeliveryType: Boolean,
        driverStatusDictionaryCode: String,
      },
      car: {
        isActiveOnDeliveryType: Boolean,
        driverStatusDictionaryCode: String,
      },
      motorcycle: {
        isActiveOnDeliveryType: Boolean,
        driverStatusDictionaryCode: String,
      },
      cargo: {
        isActiveOnDeliveryType: Boolean,
        driverStatusDictionaryCode: String,
      },
    },
    documentImage: {
      rutImage: String,
      criminalRecord: String,
      driverLicense: String,
    },
    motoInfo: {
      circulationPermit: String,
    },
    carInfo: {
      circulationPermit: String,
    },
  },
  {
    collection: "driver",
  }
)

module.exports = model("driver", driverSchema)
