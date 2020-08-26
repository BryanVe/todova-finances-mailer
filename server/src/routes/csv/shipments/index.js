const express = require("express")
const router = express.Router()
const shipmentsController = require("../../../controllers/csv/shipments")
const { verifyPeriodOfTime } = require("../../../functions/utils")

router.get("/download", verifyPeriodOfTime, shipmentsController.download)

module.exports = router
