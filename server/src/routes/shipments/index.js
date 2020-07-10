const express = require("express")
const router = express.Router()
const shipmentsController = require("../../controllers/shipments")
const verifyPeriodOfTime = require("../../functions/verifyPeriodOfTime")

router.get("/download", verifyPeriodOfTime, shipmentsController.download)

module.exports = router
