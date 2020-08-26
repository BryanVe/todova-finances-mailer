const moment = require("moment")
const momentTZ = require("moment-timezone")
const offSet = "America/Santiago"
const { translateMonth } = require("./string")

module.exports = {
  getTimeInFormat: (time, formatTime) => {
    if (formatTime === "literal") {
      const { years, months, date } = momentTZ.tz(time, offSet).toObject()
      return `${date} de ${translateMonth(months)} del ${years}`
    }

    return momentTZ.tz(time, offSet).format(formatTime)
  },
  verifyPeriodOfTime: (req, res, next) => {
    const period = req.query.period
    // The date field which will be filtered in enterprises, shipments, driverSchedules
    let createdTimeField = "createdTime"

    // We overwrite the date field in customers and drivers because the model is different
    if (req.baseUrl === "/csv/customers" || req.baseUrl === "/csv/drivers")
      createdTimeField = "details.createdTime"

    let dateConstraint = {}

    //  Filter date between two dates
    if (period === "interval") {
      const { startDate, endDate } = JSON.parse(
        decodeURIComponent(req.query.params)
      )
      dateConstraint = {
        [createdTimeField]: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      }
    }

    if (period === "one") {
      const { date } = JSON.parse(decodeURIComponent(req.query.params))
      dateConstraint = {
        [createdTimeField]: {
          $gte: new Date(date),
          $lt: new Date(moment(date).add(1, "d").toISOString()),
        },
      }
    }
    req.dateConstraint = dateConstraint
    next()
  },
}
