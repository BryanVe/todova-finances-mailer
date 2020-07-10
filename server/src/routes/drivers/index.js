const express = require("express")
const router = express.Router()
const driversController = require("../../controllers/drivers")
const verifyPeriodOfTime = require("../../functions/verifyPeriodOfTime")

router.get("/download", verifyPeriodOfTime, driversController.download)

module.exports = router
