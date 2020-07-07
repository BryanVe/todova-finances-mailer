const express = require("express")
const router = express.Router()
const shipmentsController = require("../../controllers/shipments")
const verifyPeriodOfTime = require("../../functions/verifyPeriodOfTime")

router.post("/download", verifyPeriodOfTime, shipmentsController.download)

module.exports = router
