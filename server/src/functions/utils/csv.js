const { AsyncParser } = require("json2csv")

module.exports = {
  downloadResource: (res, fileName, fields, data) => {
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
  },
}
