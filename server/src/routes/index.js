const express = require("express")
const router = express.Router()

const csvRoute = require("./csv")
const financesRoute = require("./finances")
const authRoute = require("./auth")

router.use("/auth", authRoute)
router.use("/csv", csvRoute)
router.use("/finances", financesRoute)

module.exports = router
