const express = require("express")
const router = express.Router()
const driversController = require("../../controllers/drivers")
const verifyPeriodOfTime = require("../../functions/verifyPeriodOfTime")

router.post("/download", verifyPeriodOfTime, driversController.download)

module.exports = router
