const { getTimeInFormat, verifyPeriodOfTime } = require("./date")
const {
  formatFloatStr,
  normalize,
  translateDeliveryType,
  translateMonth,
  translateRequestState,
  translateRequestType,
} = require("./string")
const { downloadResource } = require("./csv")
const {
  getBankCode,
  getRutDigits,
  getRutVeriferDigit,
  getDriverSimpleName,
} = require("./driver")
const { saveExcel } = require("./excel")

module.exports = {
  getTimeInFormat,
  verifyPeriodOfTime,
  formatFloatStr,
  normalize,
  translateDeliveryType,
  translateMonth,
  translateRequestState,
  translateRequestType,
  downloadResource,
  getBankCode,
  getRutDigits,
  getRutVeriferDigit,
  getDriverSimpleName,
  saveExcel,
}
