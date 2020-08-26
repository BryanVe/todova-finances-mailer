const express = require("express")
const router = express.Router()
const enterprisesController = require("../../../controllers/csv/enterprises")
const { verifyPeriodOfTime } = require("../../../functions/utils")

router.get("/download", verifyPeriodOfTime, enterprisesController.download)

module.exports = router
