const fs = require("fs")
const path = require("path")
const puppeteer = require("puppeteer")
const hb = require("handlebars")

const moment = require("moment")
const mkdirp = require("mkdirp")
const rimraf = require("rimraf")
const pdfFolder = path.resolve(__dirname, "../../pdfs")
const getTemplateHtml = require("./template")
const getMandrillConfig = require("../../mandrill/config")
const mandrillApiKey = require("../../mandrill/keys")

// models
const Customer = require("../../models/Customer")
const Enterprise = require("../../models/Enterprise")
const Shipment = require("../../models/Shipment")
const Driver = require("../../models/Driver")
const DriverSchedule = require("../../models/DriverSchedule")
const DriverInfo = require("../../models/DriverInfo")
const DateGenerated = require("../../models/DateGenerated")
const NotSentFile = require("../../models/NotSentFile")

const {
  getTimeInFormat,
  convertFileToBase64,
} = require("../../functions/utils")

// mandrill --------
let mandrill = require("mandrill-api")
let mandrillClient = new mandrill.Mandrill(mandrillApiKey)
// -----------------

const generatePdf = async (data, fileName) => {
  try {
    // get the html template
    const htmlTemplate = await getTemplateHtml(data)

    // compile the template
    const template = hb.compile(htmlTemplate, { strict: true })

    // insert the data on the template
    const htmlWithData = template(data)

    // run puppeteer
    const browser = await puppeteer.launch()

    // open a new page
    const page = await browser.newPage()

    // set out html to the new page
    await page.setContent(htmlWithData)

    // generate the pdf from the new page
    await page.pdf({
      path: path.join(pdfFolder, `${fileName}.pdf`),
      format: "A4",
      margin: {
        top: "2.54cm",
        bottom: "1.9cm",
        left: "1.9cm",
        right: "1.9cm",
      },
    })

    await browser.close()
  } catch (error) {
    console.log(error)
  }
}

const groupingShipmentsByDriverId = (shipments) => {
  let driverShipments = {}
  if (shipments === null) return

  shipments.forEach((shipment) => {
    if (!driverShipments[shipment.driverId]) {
      driverShipments[shipment.driverId] = [shipment]
    } else if (driverShipments[shipment.driverId]) {
      driverShipments[shipment.driverId].push(shipment)
    }
  })
  delete driverShipments[""]
  return driverShipments
}

const sendEmail = (email, fileName, textOptions = {}) => {
  return new Promise(async (resolve, reject) => {
    // textOptions = {beginDate, endDate, payDate}
    const filePath = path.join(pdfFolder, fileName)
    const fileInBase64 = await convertFileToBase64(filePath)
    const emailTo = [
      {
        // TODO: set the driver email
        // email,
        email: "bryan.ve.bv@gmail.com",
        // TODO: show the driver name
        name: "Bryan Vera",
        type: "to",
      },
    ]
    const attachments = [
      {
        type: "application/pdf",
        name: "adjunto.pdf",
        content: fileInBase64,
      },
    ]

    const mandrillConfig = getMandrillConfig(emailTo, attachments)

    mandrillClient.messages.sendTemplate(
      mandrillConfig,
      (res) => {
        // first index because we are sending just to one recipient
        const result = res[0]
        if (result.status === "rejected" || result.status === "invalid")
          return reject("The email is invalid or was rejected")

        return resolve()
        /* response example:
        [{
                "email": "recipient.email@example.com",
                "status": "sent",
                "reject_reason": "hard-bounce",
                "_id": "abc123abc123abc123abc123abc123"
            }]
        */
      },
      (e) => reject("A mandrill error occurred: " + e.name + " - " + e.message)
    )
  })
}

module.exports = {
  generateFiles: async (socket, req, res) => {
    socket.broadcast.emit("pdf-generating", true)
    const beginDate = new Date(req.body.beginDate)
    const endDate = new Date(req.body.endDate)
    const payDate = new Date(req.body.payDate)

    console.log("Generating pdfs")
    console.log("from: ", getTimeInFormat(beginDate, "literal"))
    console.log("until: ", getTimeInFormat(endDate, "literal"))

    const getShipments = async (beginDate, endDate) => {
      try {
        const shipmentStates = [
          "completed",
          "completed_with_return",
          "cancelled_by_customer",
          "cancelled_by_driver",
          "cancelled_by_todova",
        ]
        const shipments = await Shipment.find(
          {
            "actionHistory.action": { $in: shipmentStates },
            "actionHistory.time": { $gte: beginDate, $lt: endDate },
            requestState: { $in: shipmentStates },
          },
          {
            _id: 1,
            driverId: 1,
            createdTime: 1,
            actionHistory: 1,
            customerId: 1,
            customerType: 1,
            requestType: 1,
            travelDistance: 1,
            activeDeliveryType: 1,
            packages: 1,
            price: 1,
            requestState: 1,
          }
        )
          .sort({ createdTime: "ascending" })
          .lean()
        return shipments
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "Ocurrió un error en la base de datos",
          data: {},
        })
      }
    }

    const getCustomerInfo = async (customerId, customerType) => {
      try {
        if (customerType === "customer")
          return await Customer.findOne({ _id: customerId })
        else if (customerType === "enterprise")
          return await Enterprise.findOne({ _id: customerId })
        else return {}
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "Ocurrió un error en la base de datos",
          data: {},
        })
      }
    }

    const getDriverInfo = async (driverId) => {
      try {
        return await Driver.findOne({ _id: driverId })
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "Ocurrió un error en la base de datos",
          data: {},
        })
      }
    }

    const getActionTime = (shipment, action) => {
      let dateTime = shipment.createdTime
      for (let element of shipment.actionHistory) {
        if (element.action === action) {
          dateTime = element.time
          break
        }
      }
      return dateTime
    }

    const getRowShipmentInfo = async (shipment, requestState, driverPrice) => {
      let customer = await getCustomerInfo(
        shipment.customerId,
        shipment.customerType
      )
      if (customer) {
        let rowData = {
          acceptedTime: getActionTime(shipment, "accepted"),
          requestState,
          requestType: shipment.requestType ? shipment.requestType : "",
          travelDistance: shipment.travelDistance
            ? shipment.travelDistance
            : "",
          driverPrice,
          deliveryType: shipment.activeDeliveryType
            ? shipment.activeDeliveryType
            : "",
          isConsolidated: shipment.packages.length > 1,
        }
        if (shipment.customerId && shipment.customerId !== "") {
          rowData.customerName =
            shipment.customerType === "customer"
              ? `${customer.details.firstName} ${customer.details.lastName}`
              : customer.company.name
          rowData.customerRut =
            shipment.customerType === "customer"
              ? customer.details.rut
              : customer.company.rut
        }
        if (requestState === "schedule") {
          rowData.customerName = "TodoVa"
          rowData.customerRut = "TodoVa"
        }
        return rowData
      }
    }

    const getRowsShipment = async (shipment) => {
      let rows = [
        await getRowShipmentInfo(
          shipment,
          shipment.requestState,
          shipment.price.basePriceConsidered
            ? shipment.price.driverBasePrice
            : shipment.price.driverPrice
        ),
      ]
      for (let package of shipment.packages) {
        for (let [key, value] of Object.entries(package.driverAccounting)) {
          if (value > 0)
            rows.push(await getRowShipmentInfo(shipment, key, value))
        }
      }
      return rows
    }

    const getDriverSchedules = async (driverId) => {
      try {
        return await DriverSchedule.find({
          driverId,
          isEnabled: true,
          startTime: {
            $gte: beginDate,
            $lt: moment(endDate).add(1, "days").toDate(),
          },
        }).sort({ startTime: "ascending" })
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "Ocurrió un error en la base de datos",
          data: {},
        })
      }
    }

    const getRowsDriverSchedule = async (driverId, rows) => {
      let newRows = []
      let driverSchedules = await getDriverSchedules(driverId)
      for (let schedule of driverSchedules) {
        let driverPrice = 0
        let startTime = moment(schedule.startTime)
        let endTime = moment(schedule.endTime)
        for (let shipment of rows) {
          if (shipment) {
            if (
              shipment.requestState === "parkingValue" ||
              shipment.requestState === "tollValue"
            )
              continue
            let acceptedTime = moment(shipment.acceptedTime)
            if (
              acceptedTime.isSameOrBefore(endTime) &&
              acceptedTime.isSameOrAfter(startTime)
            )
              driverPrice += shipment.driverPrice
          }
        }
        driverPrice -= schedule.minDriverPay
        if (driverPrice < 0) {
          let shipment = {
            createdTime: schedule.startTime,
            actionHistory: [],
            packages: [],
          }
          newRows.push(
            await getRowShipmentInfo(shipment, "schedule", driverPrice * -1)
          )
        }
      }
      return newRows
    }

    const createPdf = async (driver, rows, beginDate, endDate, payDate) => {
      try {
        const fileName = driver.details.email
        await generatePdf(
          { driver, rows, beginDate, endDate, payDate },
          fileName
        )
      } catch (error) {
        createPdf(driver, rows, beginDate, endDate, payDate)
      }
    }

    const isShipmentCorrectDate = (shipment) => {
      let actionTime = moment(getActionTime(shipment, shipment.requestState))
      let startTime = moment(beginDate)
      let endTime = moment(endDate)
      return (
        actionTime.isSameOrBefore(endTime) &&
        actionTime.isSameOrAfter(startTime)
      )
    }

    const makeDriverPdfFiles = async (driverShipments) => {
      const totalPayList = {}
      for (let driverId in driverShipments) {
        let driver = await getDriverInfo(driverId)

        // if the driver exists in the database
        if (driver) {
          let currentTotal = 0
          let rows = []

          for (let shipment of driverShipments[driverId]) {
            if (!isShipmentCorrectDate(shipment)) continue
            if (
              // discard shipments cancelled and that it request type is no base price considered and driver price is zero
              [
                "cancelled_by_customer",
                "cancelled_by_driver",
                "cancelled_by_todova",
              ].includes(shipment.requestState) &&
              ((!shipment.price.basePriceConsidered &&
                shipment.price.driverPrice === 0) ||
                (shipment.price.basePriceConsidered &&
                  shipment.price.driverBasePrice === 0))
            )
              continue
            await getRowsShipment(shipment).then((result) => {
              result.forEach((row) => {
                rows.push(row)
              })
            })
          }

          await getRowsDriverSchedule(driverId, rows).then((result) => {
            result.forEach((row) => {
              rows.push(row)
            })
          })

          rows.forEach((shipment) => {
            if (shipment) currentTotal += parseFloat(shipment.driverPrice)
          })
          totalPayList[driver.details.email] = currentTotal
          // no create empty pdf files
          if (rows.length === 0) continue

          await createPdf(driver, rows, beginDate, endDate, payDate)
        }
      }
      return totalPayList
    }

    // create pdf's folder if it doesn't exist yet
    await mkdirp(pdfFolder)

    await rimraf(`${pdfFolder}/*`, () => {})

    let shipments = await getShipments(beginDate, endDate)
    let driverShipments = groupingShipmentsByDriverId(shipments)

    await makeDriverPdfFiles(driverShipments)

    console.log("Los pdfs fueron generados correctamente")

    const fileNames = await fs
      .readdirSync(pdfFolder)
      .filter((file) => file.indexOf(".pdf") >= 0)

    const files = await Promise.all(
      fileNames.map(
        async (file) =>
          await DriverInfo.findOne({ email: file.split(".pdf")[0] })
      )
    )

    await DateGenerated.deleteMany({})
    await DateGenerated.create({
      beginDate,
      endDate,
      payDate,
    })

    res.json({
      status: "success",
      message: "Los archivos fueron generados correctamente",
      data: {
        generateDate: {
          beginDate,
          endDate,
          payDate,
        },
        files,
      },
    })

    socket.broadcast.emit("pdf-generating", false)
  },

  getFiles: async (req, res) => {
    try {
      const fileNames = await fs
        .readdirSync(pdfFolder)
        .filter((file) => file.indexOf(".pdf") >= 0)

      const files = await Promise.all(
        fileNames.map(
          async (file) =>
            await DriverInfo.findOne({ email: file.split(".pdf")[0] })
        )
      )

      const notSentFiles = await NotSentFile.find({})
      const notSentFileNames = notSentFiles.map((doc) => doc.file)

      const generateDate = (await DateGenerated.find({}))[0]

      return res.status(200).json({
        status: "success",
        message:
          files.length > 0
            ? "Los archivos fueron cargados correctamente"
            : "No hay archivos generados en la base de datos",
        data: { generateDate, files, notSentFiles: notSentFileNames },
      })
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Ocurrió un error al cargar los archivos",
        data: {},
      })
    }
  },

  getOneFile: (req, res) => {
    const fileName = `${pdfFolder}/${req.params.file}`
    res.setHeader("Content-Type", "application/pdf")
    res.download(fileName)
  },

  sendFiles: async (req, res) => {
    const filesToSend = req.body.files
    // to modify the params of the mandrill template (dates)
    // const textOptions = req.body.textOptions

    const notSentFiles = (await NotSentFile.find({})).map((doc) => doc.file)

    let isAllSended = true

    for (let fileName of filesToSend) {
      if (notSentFiles.includes(fileName)) continue

      const email = fileName.split(".pdf")[0]
      const driverInfo = await DriverInfo.findOne({ email })

      if (driverInfo.isEmailSended) continue
      try {
        await sendEmail(email, fileName)
        await DriverInfo.findOneAndUpdate(
          { _id: driverInfo._id },
          { isEmailSended: true }
        )
      } catch (error) {
        console.log(error)
        isAllSended = false
      }
    }

    const fileNames = await fs
      .readdirSync(pdfFolder)
      .filter((file) => file.indexOf(".pdf") >= 0)

    const files = await Promise.all(
      fileNames.map(
        async (file) =>
          await DriverInfo.findOne({ email: file.split(".pdf")[0] })
      )
    )
    const data = {
      files,
    }

    if (isAllSended) {
      const message = "Todos los correos fueron enviados correctamente"
      console.log(message)
      res.status(200).json({
        status: "success",
        message,
        data,
      })
    } else {
      const message = "No todos los correos fueron enviados correctamente"
      console.log(message)
      res.status(500).json({
        status: "error",
        message,
        data,
      })
    }
  },

  setNotSentFiles: async (req, res) => {
    try {
      const files = req.body.files
      await Promise.all(
        files.map(async (file) => {
          if (req.body.operation === "set") await NotSentFile.create({ file })
          if (req.body.operation === "unset")
            await NotSentFile.deleteMany({ file })
        })
      )

      return res.status(200).json({
        status: "success",
        message:
          req.body.operation === "set"
            ? "Se añadió a la lista de no enviados correctamente"
            : "Se removió de la lista de no enviados correctamente",
        data: {},
      })
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message:
          req.body.operation === "set"
            ? "Ocurrió un error al intentar añadir a la lista de no enviados"
            : "Ocurrió un error al intentar remover de la lista de no enviados",
        data: {},
      })
    }
  },

  getNotSentFiles: async (req, res) => {
    try {
      const notSentFiles = await NotSentFile.find({})
      const files = notSentFiles.map((doc) => doc.file)

      return res.status(200).json({
        status: "success",
        message:
          files.length > 0
            ? "Los archivos no enviados fueron cargados correctamente"
            : "No existe archivos no enviados en la base de datos",
        data: {
          files,
        },
      })
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Ocurrió un error al cargar los archivos no enviados",
        data: {},
      })
    }
  },
}
