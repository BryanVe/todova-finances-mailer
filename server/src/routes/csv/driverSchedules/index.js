const express = require("express")
const router = express.Router()
const driverSchedulesController = require("../../../controllers/csv/driverSchedules")
const { verifyPeriodOfTime } = require("../../../functions/utils")

router.get("/download", verifyPeriodOfTime, driverSchedulesController.download)

module.exports = router
