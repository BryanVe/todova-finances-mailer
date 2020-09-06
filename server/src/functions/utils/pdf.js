const fs = require("fs")

module.exports = {
  convertFileToBase64: async (filePath) =>
    await fs.readFileSync(filePath).toString("base64"),
}
