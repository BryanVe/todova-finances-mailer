const moment = require("moment")
const DriverSchedule = require("../models/DriverSchedule")
const Driver = require("../models/Driver")
const Shipment = require("../models/Shipment")
const { downloadResource, getTimeInFormat } = require("../functions/utils")

const fields = [
  {
    label: "Index",
    value: "index",
  },
  {
    label: "Driver ID",
    value: "driverID",
  },
  {
    label: "Register Date",
    value: "registerDate",
  },
  {
    label: "Driver Name",
    value: "driverName",
  },
  {
    label: "Start Date",
    value: "startDate",
  },
  {
    label: "Start Time",
    value: "startTime",
  },
  {
    label: "End Date",
    value: "endDate",
  },
  {
    label: "End Time",
    value: "endTime",
  },
  {
    label: "Min Driver Pay",
    value: "minDriverPay",
  },
  {
    label: "Total Driver Profit Turn",
    value: "totalDriverProfitTurn",
  },
  {
    label: "Shipment Driver Profit Turn",
    value: "shipmentDriverProfitTurn",
  },
  {
    label: "Should Pay to Driver",
    value: "shouldPayToDriver",
  },
]

const getTotalDriverProfitShipment = async (driverId, beginDate, endDate) => {
  // check if exists at least one state with action accepted in actionHistory array with the next query
  const query = {
    driverId,
    "actionHistory.action": "accepted",
    "actionHistory.time": { $gte: beginDate, $lt: endDate },
  }
  let shipments = await Shipment.find(query)
  let totalProfit = 0
  for (let shipment of shipments) {
    if (!isShipmentCorrectDate(shipment, "accepted", beginDate, endDate))
      continue
    totalProfit += getShipmentPrice(shipment, "driver")
    for (let package of shipment.packages) {
      totalProfit +=
        package.driverAccounting.waitingTime +
        package.driverAccounting.adjustment
    }
  }
  return totalProfit
}

const isShipmentCorrectDate = (shipment, actionState, beginDate, endDate) => {
  let actionTime = moment(getActionTime(shipment, actionState))
  let startTime = moment(beginDate)
  let endTime = moment(endDate)
  return (
    actionTime.isSameOrBefore(endTime) && actionTime.isSameOrAfter(startTime)
  )
}

const getActionTime = (shipment, action) => {
  let dateTime = shipment.createdTime
  for (let index of shipment.actionHistory) {
    if (index.action === action) {
      dateTime = index.time
      break
    }
  }
  return dateTime
}

const getShipmentPrice = (shipment, user) => {
  if (user !== "customer" && user !== "driver") return 0
  if (shipment.price.basePriceConsidered) {
    return shipment.price[user + "BasePrice"]
  }
  return shipment.price[user + "Price"]
}

const getDriverName = async (driverId) => {
  // is driverId empty?
  if (driverId === "") return ""
  const driver = await Driver.findById(driverId)

  // was driver not found?
  if (!driver) return ""
  else return `${driver.details.firstName} ${driver.details.lastName}`
}

const controller = {}

controller.download = async (req, res) => {
  const dateConstraint = req.dateConstraint
  const driverSchedules = await DriverSchedule.find(
    { ...dateConstraint },
    {
      _id: 1,
      createdTime: 1,
      driverId: 1,
      startTime: 1,
      endTime: 1,
      minDriverPay: 1,
    }
  )

  const data = await Promise.all(
    driverSchedules.map(async (driverSchedule, index) => {
      const totalDriverProfit = await getTotalDriverProfitShipment(
        driverSchedule.driverId,
        driverSchedule.startTime,
        driverSchedule.endTime
      )
      const shouldPayToDriver = driverSchedule.minDriverPay - totalDriverProfit
      const shipmentDriverProfitTurn =
        shouldPayToDriver < 0 ? shouldPayToDriver * -1 : 0

      return {
        index: index + 1,
        driverID: driverSchedule.driverId,
        registerDate: getTimeInFormat(driverSchedule.createdTime, "DD-MM-YYYY"),
        driverName: await getDriverName(driverSchedule.driverId),
        startDate: getTimeInFormat(driverSchedule.startTime, "DD-MM-YYYY"),
        startTime: getTimeInFormat(driverSchedule.startTime, "HH:mm"),
        endDate: getTimeInFormat(driverSchedule.endTime, "DD-MM-YYYY"),
        endTime: getTimeInFormat(driverSchedule.endTime, "HH:mm"),
        minDriverPay: driverSchedule.minDriverPay,
        totalDriverProfitTurn: totalDriverProfit,
        shipmentDriverProfitTurn,
        shouldPayToDriver: shouldPayToDriver > 0 ? shouldPayToDriver : 0,
      }
    })
  )

  return downloadResource(res, "driverSchedules.csv", fields, data)
}

module.exports = controller
