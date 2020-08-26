const DriverInfo = require("../../models/DriverInfo")
const moment = require("moment")
const {
  translateRequestState,
  formatFloatStr,
  translateDeliveryType,
  translateRequestType,
  getTimeInFormat,
} = require("../../functions/utils")

const getTemplateHtml = async (data) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>TodoVa Report</title>
    </head>
    <body>
      <div>
        ${getHeaderSection()}
        ${getDriverSection(data)}
        ${getTitleShipmentDetails()}
        ${getShipmentSection(data)}
        ${await getTotalPrice(data)}
        ${getDescription(data)}
      </div>
    </body>
  </html>
  `
}

const getHeaderSection = () => {
  return `
  <div style="padding-top: 15px">
    <div>
      <img src="http://localhost:${process.env.PORT}/images/logo.png">
    </div>
  </div>
  <div>
    <div align="center">
      <b><label style="font-size: 14px">REPORTE DE ENVÍOS</label></b>
    </div>
  </div>
  `
}

const getDriverSection = ({ driver, beginDate, endDate }) => {
  return `
  <div>
    <table style="font-family: helvetica; font-size: 10px">
      <tr>
        <td style="width: 100px"><b>ID:</b></td>
        <td style="width: 520px">${driver._id}</td>
        <td style="width: 50px"><b>DESDE:</b></td>
        <td style="width: 100px">${getTimeInFormat(
          beginDate,
          "DD-MM-YYYY"
        )}</td>
      </tr>
      <tr>
        <td style="width: 100px"><b>NOMBRE ID:</b></td>
        <td style="width: 520px">${driver.details.firstName} ${
    driver.details.lastName
  }</td>
        <td style="width: 50px"><b>HASTA:</b></td>
        <td style="width: 100px">${getTimeInFormat(endDate, "DD-MM-YYYY")}</td>
      </tr>
      <tr>
        <td style="width: 100px"><b>TELÉFONO:</b></td>
        <td style="width: 520px">${driver.details.phone}</td>
        <td style="width: 50px"></td>
        <td style="width: 100px"></td>
      </tr>
      <tr>
        <td style="width: 100px"><b>MAIL:</b></td>
        <td style="width: 520px">${driver.details.email}</td>
        <td style="width: 50px"></td>
        <td style="width: 100px"></td>
      </tr>
      <tr>
        <td style="width: 100px"><b>RUT:</b></td>
        <td style="width: 520px">${driver.details.rut}</td>
        <td style="width: 50px"></td>
        <td style="width: 100px"></td>
      </tr>
      <tr>
        <td style="width: 100px"><b>BANCO:</b></td>
        <td style="width: 520px">${driver.bankDetails.bankName}</td>
        <td style="width: 50px"></td>
        <td style="width: 100px"></td>
      </tr>
      <tr>
        <td style="width: 100px"><b>CUENTA:</b></td>
        <td style="width: 520px">${driver.bankDetails.accountNumber}</td>
        <td style="width: 50px"></td>
        <td style="width: 100px"></td>
      </tr>
    </table>
  </div>
  `
}

const getTitleShipmentDetails = () => {
  return `
  <div style="font-family: helvetica; font-size: 11px;">
    <div align="center">
      <b><label>DETALLES DE ENVÍOS</label></b>
    </div>
  </div>
  `
}

const getShipmentSection = ({ rows }) => {
  return `
  <div>
    <table style="width:100%; border-collapse: collapse; font-family: helvetica; font-size: 10px; border:1px solid black;">
      <tr>
        <th style="background-color: #402a3f; color: white; text-align: center;">Fecha</th>
        <th style="background-color: #402a3f; color: white; text-align: center;">Nombre Cliente</th>
        <th style="background-color: #402a3f; color: white; text-align: center;">Envío</th>
        <th style="background-color: #402a3f; color: white; text-align: center; width: 11%">Rut</th>
        <th style="background-color: #402a3f; color: white; text-align: center;">TE</th>
        <th style="background-color: #402a3f; color: white; text-align: center;">Hora</th>
        <th style="background-color: #402a3f; color: white; text-align: center;">Kms</th>
        <th style="background-color: #402a3f; color: white; text-align: center;">Ganancia $</th>
        <th style="background-color: #402a3f; color: white; text-align: center;">Categoría</th>
      </tr>
      ${getShipmentRowsSection(rows)}
    </table>
  </div>
  `
}

const getShipmentRowsSection = (shipmentRows) => {
  let rows = ""
  shipmentRows.forEach((row) => {
    if (row) {
      rows += "<tr>"
      rows += `<td style="border:1px solid black; text-align: center">${moment(
        row.acceptedTime
      ).format("DD-MM-YYYY")}</td>`
      rows += `<td style="border:1px solid black; text-align: left">${row.customerName}</td>`
      rows += `<td style="border:1px solid black; text-align: center">${translateRequestState(
        row.requestState
      )}</td>`
      rows += `<td style="border:1px solid black; text-align: center">${row.customerRut}</td>`
      rows += `<td style="border:1px solid black; text-align: center">${translateRequestType(
        row.requestType,
        row.isConsolidated
      )}</td>`
      rows += `<td style="border:1px solid black; text-align: center">${moment(
        row.acceptedTime
      ).format("HH:mm")}</td>`
      rows += `<td style="border:1px solid black; text-align: center">${(
        row.travelDistance / 1000
      )
        .toFixed(1)
        .toString()}</td>`
      rows += `<td style="border:1px solid black; text-align: right">${formatFloatStr(
        row.driverPrice
      )}</td>`
      rows += `<td style="border:1px solid black; text-align: center">${translateDeliveryType(
        row.deliveryType
      )}</td>`
      rows += "</tr>"
    }
  })
  return rows
}

const getTotalPrice = async ({ rows: shipmentRows, driver }) => {
  let totalPay = 0
  shipmentRows.forEach((shipment) => {
    if (shipment) totalPay += parseFloat(shipment.driverPrice)
  })

  // update the driver info in the database
  await DriverInfo.deleteMany({ email: driver.details.email })
  await DriverInfo.create({
    email: driver.details.email,
    totalPay,
    isEmailSended: false,
  })

  return `
    <br> 
    <div style="font-family: helvetica; font-size: 10px;">
      <div align="right">
        <b style="border:2px solid black; padding: 5px 5px 5px 5px;"><label>TOTAL A PAGAR $: &nbsp; &nbsp; &nbsp; ${formatFloatStr(
          totalPay
        )}</label></b>
      </div>
    </div>
  `
}

const getDescription = ({ payDate }) => {
  return `
  <br>
  <div style="font-family: helvetica; font-size: 10px;">
    <div align="left">
      <b><label>(*) Las transferencias se realizarán el día ${getTimeInFormat(
        payDate,
        "literal"
      )} , entre las 12:00 y 18:00 horas.</label></b><br>
      <b><label>TE/Tipo de Envío. &nbsp; &nbsp; I/Ida. &nbsp; &nbsp; I-V/Ida y Vuelta &nbsp; &nbsp; C/Consolidado</label></b><br>
      <b><label>(**) Si necesitas mayor información comunicate a finanzas@todova.cl</label></b>
    </div>
  </div>
  `
}

module.exports = getTemplateHtml
