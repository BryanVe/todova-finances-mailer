const express = require("express")
const router = express.Router()
const driversController = require("../../../controllers/csv/drivers")
const { verifyPeriodOfTime } = require("../../../functions/utils")

router.get("/download", verifyPeriodOfTime, driversController.download)

module.exports = router
