const fs = require("fs")
const path = require("path")
const utils = require("util")
const puppeteer = require("puppeteer")
const hb = require("handlebars")

const readFile = utils.promisify(fs.readFile)

const moment = require("moment")
const mkdirp = require("mkdirp")
const rimraf = require("rimraf")
const pdfFolder = path.resolve(__dirname, "../../pdfs")

const ShipmentRequest = require("../../models/Shipment")
const Customer = require("../../models/Customer")
const Enterprise = require("../../models/Enterprise")
const Driver = require("../../models/Driver")
const DriverSchedule = require("../../models/DriverSchedule")

// -----------------------------------------

const getTemplateHtml = async () => {
  try {
    // read the html template file
    const templateFilePath = path.join(__dirname, "template.html")
    return await readFile(templateFilePath, "utf8")
  } catch (error) {
    return error
  }
}

const generatePdf = async (data, fileName) => {
  try {
    // get the html template
    const htmlTemplate = await getTemplateHtml()

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
    })

    await browser.close()
  } catch (error) {
    console.log(error)
  }
}

// -----------------------------------------

module.exports = {
  generateFiles: async (socket, req, res) => {
    socket.broadcast.emit("pdf-generating", true)
    const beginDate = new Date(req.body.beginDate)
    const endDate = new Date(req.body.endDate)
    // const payDate = new Date(req.body.payDate)

    console.log("Generating pdfs")
    console.log("from: ", moment(beginDate).toISOString())
    console.log("until: ", moment(endDate).toISOString())

    const getShipments = async (beginDate, endDate) => {
      try {
        const shipmentStates = [
          "completed",
          "completed_with_return",
          "cancelled_by_customer",
          "cancelled_by_driver",
          "cancelled_by_todova",
        ]
        const shipments = await ShipmentRequest.find(
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
        res.status(500).send("Database error")
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

    const getCustomerInfo = async (customerId, customerType) => {
      try {
        if (customerType === "customer")
          return await Customer.findOne({ _id: customerId })
        else if (customerType === "enterprise")
          return await Enterprise.findOne({ _id: customerId })
        else return {}
      } catch (error) {
        res.status(500).send("Database error")
      }
    }

    const getDriverInfo = async (driverId) => {
      try {
        return await Driver.findOne({ _id: driverId })
      } catch (error) {
        res.status(500).send("Database error")
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
        res.status(500).send("Database error")
      }
    }

    const getRowsDriverSchedule = async (driverId, rows) => {
      // use socketio
      // sails.sockets.blast("pdf-generating", true);
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

    const createPdf = async (
      driver,
      rows,
      beginDate,
      endDate,
      fortnight,
      month
    ) => {
      try {
        const data = {
          testId: driver._id,
          testFirstName: driver.details.firstName,
          testLastName: driver.details.lastName,
          testEmail: driver.details.email,
        }
        const fileName = driver.details.email
        await generatePdf(data, fileName)
      } catch (error) {
        createPdf(driver, rows, beginDate, endDate, fortnight, month)
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
      global.total = 0
      for (let driverId in driverShipments) {
        let driver = await getDriverInfo(driverId)

        // if the driver exists in the database
        if (driver) {
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

          // no create empty pdf files
          if (rows.length === 0) continue
          await createPdf(
            driver,
            rows,
            beginDate,
            endDate,
            req.body.fortnight,
            req.body.month
          )
        }
      }
    }

    // create pdf's folder if it doesn't exist yet
    await mkdirp(pdfFolder)

    await rimraf(`${pdfFolder}/*`, () => {})

    let shipments = await getShipments(beginDate, endDate)
    let driverShipments = groupingShipmentsByDriverId(shipments)

    await makeDriverPdfFiles(driverShipments)

    console.log("Pdfs have been generated successfully")

    const files = await fs
      .readdirSync(pdfFolder)
      .filter((file) => file.indexOf(".pdf") >= 0)

    res.json({
      files,
    })

    socket.broadcast.emit("pdf-generating", false)
  },

  getFiles: async (socket, req, res) => {
    const files = await fs
      .readdirSync(pdfFolder)
      .filter((file) => file.indexOf(".pdf") >= 0)

    res.json({
      files,
    })
  },
}
