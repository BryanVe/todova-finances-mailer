const express = require("express")
const customers = require("./customers")
const drivers = require("./drivers")
const enterprises = require("./enterprises")
const shipments = require("./shipments")
const driverSchedules = require("./driverSchedules")

const router = express.Router()

router.use("/customers", customers)
router.use("/drivers", drivers)
router.use("/enterprises", enterprises)
router.use("/shipments", shipments)
router.use("/driverSchedules", driverSchedules)

module.exports = router
