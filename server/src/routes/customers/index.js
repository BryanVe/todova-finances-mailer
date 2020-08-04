const express = require("express")
const router = express.Router()
const customersController = require("../../controllers/csv/customers")
const verifyPeriodOfTime = require("../../functions/verifyPeriodOfTime")

router.get("/download", verifyPeriodOfTime, customersController.download)

module.exports = router
