const moment = require("moment")

const verifyPeriodOfTime = (req, res, next) => {
  const period = req.query.period
  // The date field which will be filtered in enterprises, shipments, driverSchedules
  let createdTimeField = "createdTime"

  // We overwrite the date field in customers and drivers because the model is different
  if (req.baseUrl === "/customers" || req.baseUrl === "/drivers")
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

  // Filter date from start to end of one day
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
}

module.exports = verifyPeriodOfTime
