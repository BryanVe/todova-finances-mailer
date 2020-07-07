const express = require("express")
const router = express.Router()
const driverSchedulesController = require("../../controllers/driverSchedules")
const verifyPeriodOfTime = require("../../functions/verifyPeriodOfTime")

router.post("/download", verifyPeriodOfTime, driverSchedulesController.download)

module.exports = router
