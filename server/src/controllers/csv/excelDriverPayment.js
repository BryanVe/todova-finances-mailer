const fs = require("fs")
const path = require("path")
const DriverInfo = require("../../models/DriverInfo")
const Driver = require("../../models/Driver")

const pdfFolder = path.resolve(__dirname, "../../pdfs")

const {
  normalize,
  getBankCode,
  getRutDigits,
  getRutVeriferDigit,
  saveExcel,
  getDriverSimpleName,
} = require("../../functions/utils")

const bankAccountTodova = "52210472"

module.exports = {
  download: async (req, res) => {
    req.setTimeout(0)
    const fileName = "drivers-pay.xls"

    const fields = [
      "Nº Cuenta de Cargo",
      "Nº Cuenta de Destino",
      "Banco Destino",
      "Rut Beneficiario",
      "Dig. Verif. Beneficiario",
      "Nombre Beneficiario",
      "Monto Transferencia",
      "Nro.Factura Boleta (1)",
      "Nº Orden de Compra(1)",
      "Tipo de Pago(2)",
      "Mensaje Destinatario (3)",
      "Email Destinatario(3)",
      "Cuenta Destino inscrita como(4)",
    ]

    const files = await fs
      .readdirSync(pdfFolder)
      .filter((file) => file.indexOf(".pdf") >= 0)

    let driversInfo = await Promise.all(
      files.map(async (file) => {
        return await DriverInfo.findOne({ email: file.split(".pdf")[0] })
      })
    )

    const rows = await Promise.all(
      driversInfo.map(async (driverInfo) => {
        let driver = await Driver.findOne({ "details.email": driverInfo.email })
        if (driver != undefined && driver.bankDetails != undefined) {
          let bankReceiverRut =
            driver.bankDetails.receiverRut &&
            driver.bankDetails.receiverRut !== ""
              ? driver.bankDetails.receiverRut
              : driver.details.rut
          let bankReceiverName =
            driver.bankDetails.receiverName &&
            driver.bankDetails.receiverName !== ""
              ? driver.bankDetails.receiverName
              : `${driver.details.firstName} ${driver.details.lastName}`
          const payType = "OTR"
          const payMessage = "PAGO TODOVA"
          return [
            bankAccountTodova,
            driver.bankDetails.accountNumber,
            getBankCode(driver.bankDetails.bankName),
            getRutDigits(bankReceiverRut),
            getRutVeriferDigit(bankReceiverRut),
            normalize(bankReceiverName.toUpperCase()),
            driverInfo.totalPay,
            "",
            "",
            payType,
            payMessage,
            driverInfo.email.toLowerCase(),
            normalize(getDriverSimpleName(driver).toUpperCase()),
          ]
        }
      })
    )

    rows.unshift(fields)
    await saveExcel(res, fileName, rows)
  },
}
