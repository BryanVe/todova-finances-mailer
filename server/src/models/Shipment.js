const { Schema, model, Types } = require("mongoose")

const shipmentSchema = new Schema(
  {
    _id: Types.ObjectId,
    createdTime: Date,
    requestState: String,
    requestType: String,
    driverId: String,
    driverInfo: {
      name: String,
    },
    customerInfo: {
      name: String,
    },
    customerId: String,
    customerType: String,
    pickupInfo: {
      direction: String,
    },
    packages: Array,
    travelDistance: Number,
    activeDeliveryType: String,
    price: {
      priceModelUsed: String,
      basePriceConsidered: Boolean,
      customerBasePrice: Number,
      customerPrice: Number,
      customerReturnPrice: Number,
      driverBasePrice: Number,
      driverPrice: Number,
      driverReturnPrice: Number,
    },
    actionHistory: Array,
    timeAtShipmentCompleted: Date,
    metadata: {
      emailDatetime: String,
    },
    supportImages: Array,
  },
  {
    collection: "shipmentRequest",
  }
)

module.exports = model("shipmentRequest", shipmentSchema)
