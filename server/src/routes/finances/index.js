const express = require("express")
const router = express.Router()
const pdfFilesController = require("../../controllers/finances/pdfFiles")
const excelDriverPaymentController = require("../../controllers/csv/excelDriverPayment")

router.get("/pdf-files", pdfFilesController.getFiles)
router.get("/pdf-files/:file", pdfFilesController.getOneFile)
router.post("/pdf-files/send", pdfFilesController.sendFiles)
router.post("/not-sent-files", pdfFilesController.setNotSentFiles)
router.get("/not-sent-files", pdfFilesController.getNotSentFiles)
router.get("/excel-driver-payment", excelDriverPaymentController.download)

module.exports = router
