// const { Parser } = require("json2csv")
const { AsyncParser } = require("json2csv")
const moment = require("moment")

// const downloadResourceSync = (res, fileName, fields, data) => {
//   const json2csv = new Parser({ fields })
//   const csv = json2csv.parse(data)
//   res.header("Content-Type", "text/csv")
//   res.attachment(fileName)
//   return res.send(csv)
// }

// we use asynchronous parser for large amounts of data
const downloadResource = (res, fileName, fields, data) => {
  const opts = { fields }
  const transformOpts = { highWaterMark: 8192 }
  const asyncParser = new AsyncParser(opts, transformOpts)
  const stringifiedData = JSON.stringify(data)

  let csv = ""
  asyncParser.input.push(stringifiedData)
  asyncParser.input.push(null)

  asyncParser.processor
    .on("data", (chunk) => (csv += chunk.toString()))
    .on("end", () => {
      res.header("Content-Type", "text/csv")
      res.attachment(fileName)
      return res.send(csv)
    })
    .on("error", (err) => console.error(err))
}

const getTimeInFormat = (time, formatTime) => moment(time).format(formatTime)

module.exports = { downloadResource, getTimeInFormat }
