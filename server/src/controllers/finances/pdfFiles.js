const fs = require("fs")
const path = require("path")
const puppeteer = require("puppeteer")
const hb = require("handlebars")

const moment = require("moment")
const mkdirp = require("mkdirp")
const rimraf = require("rimraf")
const nodemailer = require("nodemailer")
const pdfFolder = path.resolve(__dirname, "../../pdfs")
const getTemplateHtml = require("./template")

// models
const Customer = require("../../models/Customer")
const Enterprise = require("../../models/Enterprise")
const Shipment = require("../../models/Shipment")
const Driver = require("../../models/Driver")
const DriverSchedule = require("../../models/DriverSchedule")
const DriverInfo = require("../../models/DriverInfo")
const DateGenerated = require("../../models/DateGenerated")
const NotSentFile = require("../../models/NotSentFile")

const { getTimeInFormat } = require("../../functions/utils")

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

const sendEmail = async (credentials, emailTo, filename, textOptions) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: credentials.user,
        pass: credentials.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    let header =
      '<div style="font-size:12.8px;color:rgb(76,17,48);width:749.688px;margin-left:41.6406px;font-family:&quot;open sans&quot;,sans-serif;padding-bottom:20px;float:left"><img src="https://s3.sa-east-1.amazonaws.com/todovapersonal/logoMail.png" alt="TodoVa Logo" class="CToWUd a6T" tabindex="0"><br><br><img src="https://s3.sa-east-1.amazonaws.com/todovapersonal/todovadriver.jpg" alt="TodoVa Driver" width="454" height="155" class="CToWUd a6T" tabindex="1"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 407.625px; top: 180px;"><div id=":v2" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Descargar el archivo adjunto image.png" data-tooltip-class="a1V" data-tooltip="Descargar"><div class="aSK J-J5-Ji aYr"></div></div><div id=":v3" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Guardar el archivo adjunto image.png en Drive" data-tooltip-class="a1V" data-tooltip="Guardar en Drive"><div class="wtScjd J-J5-Ji aYr aQu"><div class="T-aT4" style="display: none;"><div></div><div class="T-aT4-JX"></div></div></div></div></div><br></div>'
    let body = `<div style="background-image:initial;background-position:initial;background-size:initial;background-repeat:initial;background-origin:initial;background-clip:initial;width:749.688px;margin-left:41.6406px;padding-left:0px;padding-right:0px;padding-bottom:20px;margin-bottom:20px;float:left"><span style="font-size:12.8px"><font face="trebuchet ms, sans-serif" color="#4c1130"></font></span><p style="color:rgb(76,17,48);font-family:&quot;trebuchet ms&quot;,sans-serif;font-size:18px;width:674.719px;margin-left:37.4844px;float:left"><font face="trebuchet ms, sans-serif">Estimad@:</font></p><span style="font-size:12.8px"><font face="trebuchet ms, sans-serif" color="#4c1130"></font></span><p style="color:rgb(76,17,48);font-family:&quot;trebuchet ms&quot;,sans-serif;font-size:12.8px;width:674.719px;margin-left:37.4844px;float:left;margin-top:0px"><font face="trebuchet ms, sans-serif" color="#666666">Esperamos que te encuentres bien!&nbsp;</font></p><p style="color:rgb(76,17,48);font-family:&quot;trebuchet ms&quot;,sans-serif;font-size:12.8px;width:674.719px;margin-left:37.4844px;float:left;margin-top:0px"><font face="trebuchet ms, sans-serif" color="#666666">Te adjuntamos tu reporte de envíos&nbsp;correspondientes al período del ${getTimeInFormat(
      textOptions.beginDate,
      "literal"
    )} al ${getTimeInFormat(
      textOptions.endDate,
      "literal"
    )}.&nbsp;</font></p><p style="color:rgb(76,17,48);font-family:&quot;trebuchet ms&quot;,sans-serif;font-size:12.8px;width:674.719px;margin-left:37.4844px;float:left;margin-top:0px"><font face="trebuchet ms, sans-serif" color="#666666">Te informamos que se realizarán las transferencias el día ${getTimeInFormat(
      textOptions.payDate,
      "literal"
    )}, entre las 12:00 y 18:00 horas.</font></p><p style="color:rgb(76,17,48);font-family:&quot;trebuchet ms&quot;,sans-serif;font-size:12.8px;width:674.719px;margin-left:37.4844px;float:left;margin-top:0px"><span style="color:rgb(102,102,102)">Si tienes dudas escríbenos, estamos aquí para ayudarte.</span></p><p style="width:674.719px;margin-left:37.4844px;float:left;margin-top:0px"><font face="trebuchet ms, sans-serif" color="#666666"><font color="#4c1130"><span style="font-size:12.8px">Aprovechamos de </span></font><span style="font-size:12.8px">agradecer</span><font color="#4c1130"><span style="font-size:12.8px">&nbsp;que seas parte de TodoVa! Y contarte que seguimos trabajando a toda máquina para que la cantidad de envíos siga aumentando.</span></font></font></p></div>`
    let footer =
      '<div style="font-size:12.8px;color:rgb(76,17,48);font-family:&quot;trebuchet ms&quot;,sans-serif;background-image:initial;background-position:initial;background-size:initial;background-repeat:initial;background-origin:initial;background-clip:initial;width:749.688px;margin-left:41.6406px;padding-left:0px;padding-right:0px;padding-bottom:20px;margin-bottom:20px;float:left"><p style="width:674.719px;margin-left:37.4844px;float:left;font-size:14px;margin-top:0px"><strong style="font-size:small"><font color="#4c1130" face="trebuchet ms, sans-serif" size="4">Saludos! Equipo TodoVa!</font></strong></p></div>'

    let options = {
      from: `"Finanzas TodoVa" <${credentials.user}>`,
      // TODO -> to: emailTo,
      to: "gverae@uni.pe",
      sender: credentials.user,
      replyTo: credentials.user,
      subject: "Reporte de Envíos",
      html: `${header}${body}${footer}`,
      attachments: [
        {
          filename: "adjunto.pdf",
          path: path.resolve(__dirname, `${pdfFolder}/${filename}`),
        },
      ],
    }

    const result = await transporter.sendMail(options)
    return result
  } catch (error) {
    throw error
  }
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
        res.status(500).send("Database error")
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

    console.log("Pdfs have been generated successfully\n\n")

    const files = await fs
      .readdirSync(pdfFolder)
      .filter((file) => file.indexOf(".pdf") >= 0)

    const data = await Promise.all(
      files.map(
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
      generateDate: {
        beginDate,
        endDate,
        payDate,
      },
      data,
    })

    socket.broadcast.emit("pdf-generating", false)
  },

  getFiles: async (req, res) => {
    const files = await fs
      .readdirSync(pdfFolder)
      .filter((file) => file.indexOf(".pdf") >= 0)

    const generateDate = (await DateGenerated.find({}))[0]

    const data = await Promise.all(
      files.map(
        async (file) =>
          await DriverInfo.findOne({ email: file.split(".pdf")[0] })
      )
    )

    res.json({ generateDate, data })
  },

  getOneFile: (req, res) => {
    const fileName = `${pdfFolder}/${req.params.file}`
    res.setHeader("Content-Type", "application/pdf")
    res.download(fileName)
  },

  sendFiles: async (req, res) => {
    const filesToSend = req.body.files

    const notSentFiles = (await NotSentFile.find({})).map((doc) => doc.file)

    let isAllSended = true
    for (let fileName of filesToSend) {
      if (notSentFiles.includes(fileName)) continue

      const email = fileName.split(".pdf")[0]
      const driverInfo = await DriverInfo.findOne({ email })

      if (driverInfo.isEmailSended) continue

      try {
        let sendAction = await sendEmail(
          req.body.credentials,
          email,
          fileName,
          req.body.textOptions
        )
        if (sendAction.accepted.length > 0)
          await DriverInfo.findOneAndUpdate(
            { _id: driverInfo._id },
            { isEmailSended: true }
          )
      } catch (err) {
        if (err.command && err.command === "AUTH PLAIN")
          return res.status(500).json({
            status: "error",
            message: "La contraseña ingresada es incorrecta",
            data: {},
          })
        isAllSended = false
        console.log(err)
      }
    }

    if (isAllSended) {
      console.log("Todos los correos fueron enviados exitósamente")
      res.status(200).json({
        status: "success",
        message: "Todos los correos fueron enviados exitósamente",
        data: {},
      })
    } else {
      console.log("No todos los correos fueron enviados exitósamente")
      res.status(500).json({
        status: "error",
        message: "No todos los correos fueron enviados exitósamente",
        data: {},
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

      res.status(200).end()
    } catch (error) {
      res.status(500).end()
    }
  },

  getNotSentFiles: async (req, res) => {
    const notSentFiles = await NotSentFile.find({})
    const files = notSentFiles.map((doc) => doc.file)

    res.json(files)
  },
}
