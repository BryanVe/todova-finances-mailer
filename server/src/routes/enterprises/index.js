const express = require("express")
const router = express.Router()
const enterprisesController = require("../../controllers/enterprises")
const verifyPeriodOfTime = require("../../functions/verifyPeriodOfTime")

router.get("/download", verifyPeriodOfTime, enterprisesController.download)

module.exports = router
