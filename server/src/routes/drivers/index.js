const express = require("express")
const router = express.Router()
const driversController = require("../../controllers/csv/drivers")
const verifyPeriodOfTime = require("../../functions/verifyPeriodOfTime")

router.get("/download", verifyPeriodOfTime, driversController.download)

module.exports = router
