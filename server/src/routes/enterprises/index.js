const express = require("express")
const router = express.Router()
const enterprisesController = require("../../controllers/enterprises")
const verifyPeriodOfTime = require("../../functions/verifyPeriodOfTime")

router.post("/download", verifyPeriodOfTime, enterprisesController.download)

module.exports = router
