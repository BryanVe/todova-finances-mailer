const moment = require("moment")
const Shipment = require("../models/Shipment")
const Driver = require("../models/Driver")
const Customer = require("../models/Customer")
const { downloadResource, getTimeInFormat } = require("../functions/utils")

const fields = [
  {
    label: "Index",
    value: "index",
  },
  {
    label: "Shipment ID",
    value: "shipmentID",
  },
  {
    label: "Register Date",
    value: "registerDate",
  },
  {
    label: "State",
    value: "state",
  },
  {
    label: "Request Type",
    value: "requestType",
  },
  {
    label: "Driver ID",
    value: "driverID",
  },
  {
    label: "Driver Name",
    value: "driverName",
  },
  {
    label: "Customer ID",
    value: "customerID",
  },
  {
    label: "Customer Name",
    value: "customerName",
  },
  {
    label: "Customer Type",
    value: "customerType",
  },
  {
    label: "Pickup Location",
    value: "pickupLocation",
  },
  {
    label: "Dropoff Location",
    value: "dropoffLocation",
  },
  {
    label: "Package State",
    value: "packageState",
  },
  {
    label: "KMs",
    value: "kilometers",
  },
  {
    label: "Delivery Type",
    value: "deliveryType",
  },
  {
    label: "Plan",
    value: "plan",
  },
  {
    label: "Customer Price",
    value: "customerPrice",
  },
  {
    label: "Customer Waiting Time (Brute)",
    value: "customerWaitingTimeBrute",
  },
  {
    label: "Customer Adjustment (Brute)",
    value: "customerAdjustmentBrute",
  },
  {
    label: "Customer Parking (Net)",
    value: "customerParkingNet",
  },
  {
    label: "Customer Toll (Net)",
    value: "customerTollNet",
  },
  {
    label: "Driver Price",
    value: "driverPrice",
  },
  {
    label: "Driver Waiting Time (Brute)",
    value: "driverWaitingTimeBrute",
  },
  {
    label: "Driver Adjustment (Brute)",
    value: "driverAdjustmentBrute",
  },
  {
    label: "Driver Parking (Net)",
    value: "driverParkingNet",
  },
  {
    label: "Driver Toll (Net)",
    value: "driverTollNet",
  },
  {
    label: "Accept Time",
    value: "acceptTime",
  },
  {
    label: "Dropoff Time",
    value: "dropoffTime",
  },
  {
    label: "Complete Date",
    value: "completeDate",
  },
  {
    label: "Complete Time",
    value: "completeTime",
  },
  {
    label: "Email Date",
    value: "emailDate",
  },
  {
    label: "Email Time",
    value: "emailTime",
  },
  {
    label: "Dropoff Size",
    value: "dropoffSize",
  },
  {
    label: "Have a Picture",
    value: "haveAPicture",
  },
  {
    label: "Dispatch Image",
    value: "dispatchImage",
  },
  {
    label: "Parking Image",
    value: "parkingImage",
  },
  {
    label: "Tollgate Image",
    value: "tollgateImage",
  },
  {
    label: "Other Image",
    value: "otherImage",
  },
  {
    label: "Customer Return Price",
    value: "customerReturnPrice",
  },
  {
    label: "Driver Return Price",
    value: "driverReturnPrice",
  },
]

const getDriverName = async (driverId) => {
  // driverId empty
  if (driverId === "") return ""
  const driver = await Driver.findById(driverId)

  // driver not found
  if (!driver) return ""
  else return `${driver.details.firstName} ${driver.details.lastName}`
}

const getCustomerName = async (customerId) => {
  // customerId empty
  if (customerId === "") return ""
  const customer = await Customer.findById(customerId)

  // customer not found
  if (!customer) return ""
  else return `${customer.details.firstName} ${customer.details.lastName}`
}

const getShipmentModelTime = (accounting, keyTime, packages) =>
  packages.reduce(
    (total, currentPackage) => total + currentPackage[accounting][keyTime],
    0
  )

const getActionHistoryFormat = (actionHistory, state, format) => {
  let time = ""
  actionHistory.forEach((actHist) => {
    if (actHist.action === state) time = getTimeInFormat(actHist.time, format)
  })
  return time
}

const getCompletedTimeFormat = (
  actionHistory,
  timeAtShipmentCompleted,
  format
) => {
  let completedTime = moment(timeAtShipmentCompleted)
  let str = ""
  if (moment().diff(completedTime, "years") > 2000) {
    actionHistory.forEach((actHist) => {
      if (
        actHist.action === "completed" ||
        actHist.action === "completed_with_return"
      ) {
        str = getTimeInFormat(actHist.time, format)
      }
    })
  } else {
    str = completedTime.format(format)
  }
  return str
}

const getImagePosition = (imageType, shipment) => {
  let str = ""
  shipment.supportImages.forEach((img, index) => {
    str += img.imageType === imageType ? `R[${index}], ` : ""
  })
  shipment.packages.forEach((package, i) => {
    package.supportImages.forEach((img, j) => {
      str += img.imageType === imageType ? `P[${i}][${j}], ` : ""
    })
  })
  str = '"' + str.slice(0, str.lastIndexOf(",")) + '"'
  return str
}

const getDropoffDirections = (packages) => {
  let str = ""
  packages.forEach((package, index) => {
    str +=
      packages.length - 1 !== index
        ? String(index + 1) + ": " + package.dropoffInfo.direction + "  |  "
        : String(index + 1) + ": " + package.dropoffInfo.direction
  })
  return str
}

const getDropoffStates = (packages) => {
  let str = ""
  packages.forEach((package, index) => {
    str +=
      packages.length - 1 !== index
        ? String(index + 1) + ": " + package.requestState + "  |  "
        : String(index + 1) + ": " + package.requestState
  })
  return str
}

const existsFieldWithValue = (array, field, value) => {
  for (item of array) if (item[field] === value) return true
  return false
}

const getDropoffTimes = (packages) => {
  let str = ""
  packages.forEach((package, index) => {
    if (
      package.actionHistory.length !== 0 &&
      existsFieldWithValue(package.actionHistory, "action", "at_dropoff")
    )
      str +=
        packages.length - 1 !== index
          ? String(index + 1) +
            ": " +
            getActionHistoryFormat(
              package.actionHistory,
              "at_dropoff",
              "HH:mm"
            ) +
            "  |  "
          : String(index + 1) +
            ": " +
            getActionHistoryFormat(package.actionHistory, "at_dropoff", "HH:mm")
  })
  return str
}

const controller = {}

controller.download = async (req, res) => {
  const dateConstraint = req.dateConstraint
  const shipments = await Shipment.find(
    { ...dateConstraint },
    {
      _id: 1,
      createdTime: 1,
      requestState: 1,
      requestType: 1,
      driverId: 1,
      customerId: 1,
      customerType: 1,
      pickupInfo: 1,
      packages: 1,
      travelDistance: 1,
      activeDeliveryType: 1,
      price: 1,
      actionHistory: 1,
      timeAtShipmentCompleted: 1,
      metadata: 1,
      supportImages: 1,
    }
  )

  const data = await Promise.all(
    shipments.map(async (shipment, index) => ({
      index: index + 1,
      shipmentID: shipment._id,
      registerDate: getTimeInFormat(shipment.createdTime, "DD-MM-YYYY"),
      state: shipment.requestState,
      requestType: shipment.requestType,
      driverID: shipment.driverId,
      driverName: await getDriverName(shipment.driverId),
      customerID: shipment.customerId,
      customerName: await getCustomerName(shipment.customerId),
      customerType: shipment.customerType,
      pickupLocation: shipment.pickupInfo.direction,
      dropoffLocation: getDropoffDirections(shipment.packages),
      packageState: getDropoffStates(shipment.packages),
      kilometers: shipment.travelDistance,
      deliveryType: shipment.activeDeliveryType,
      plan: shipment.price.priceModelUsed,
      customerPrice: shipment.price.basePriceConsidered
        ? shipment.price.customerBasePrice
        : shipment.price.customerPrice,
      customerWaitingTimeBrute:
        getShipmentModelTime(
          "customerAccounting",
          "waitingTime",
          shipment.packages
        ) * 1.19,
      customerAdjustmentBrute:
        getShipmentModelTime(
          "customerAccounting",
          "adjustment",
          shipment.packages
        ) * 1.19,
      customerParkingNet: getShipmentModelTime(
        "customerAccounting",
        "parkingValue",
        shipment.packages
      ),
      customerTollNet: getShipmentModelTime(
        "customerAccounting",
        "tollValue",
        shipment.packages
      ),
      driverPrice: shipment.price.basePriceConsidered
        ? shipment.price.driverBasePrice
        : shipment.price.driverPrice,
      driverWaitingTimeBrute: getShipmentModelTime(
        "driverAccounting",
        "waitingTime",
        shipment.packages
      ),
      driverAdjustmentBrute: getShipmentModelTime(
        "driverAccounting",
        "adjustment",
        shipment.packages
      ),
      driverParkingNet: getShipmentModelTime(
        "driverAccounting",
        "parkingValue",
        shipment.packages
      ),
      driverTollNet: getShipmentModelTime(
        "driverAccounting",
        "tollValue",
        shipment.packages
      ),
      acceptTime: getActionHistoryFormat(
        shipment.actionHistory,
        "accepted",
        "HH:mm"
      ),
      dropoffTime: getDropoffTimes(shipment.packages),
      completeDate: getCompletedTimeFormat(
        shipment.actionHistory,
        shipment.timeAtShipmentCompleted,
        "YYYY-MM-DD"
      ),
      completeTime: getCompletedTimeFormat(
        shipment.actionHistory,
        shipment.timeAtShipmentCompleted,
        "HH:mm"
      ),
      emailDate: !!shipment.metadata.emailDatetime
        ? getTimeInFormat(shipment.metadata.emailDatetime, "DD-MM-YYYY")
        : "",
      dropoffSize: shipment.packages.length,
      emailTime: !!shipment.metadata.emailDatetime
        ? getTimeInFormat(shipment.metadata.emailDatetime, "HH:mm")
        : "",
      haveAPicture:
        shipment.supportImages.length ||
        shipment.packages.some((pack) => pack.supportImages.length)
          ? "Yes"
          : "No",
      dispatchImage: getImagePosition("dispatch_image", shipment),
      parkingImage: getImagePosition("parking_image", shipment),
      tollgateImage: getImagePosition("tollgate_image", shipment),
      otherImage: getImagePosition("other_image", shipment),
      customerReturnPrice: shipment.price.customerReturnPrice,
      driverReturnPrice: shipment.price.driverReturnPrice,
    }))
  )

  return downloadResource(res, "shipments.csv", fields, data)
}

module.exports = controller
