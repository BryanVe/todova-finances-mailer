const xl = require("excel4node")

module.exports = {
  saveExcel: async (res, filename, cells) => {
    let wb = new xl.Workbook()
    let ws = wb.addWorksheet("Sheet 1")
    cells.forEach((cell, i) => {
      cell.forEach((val, j) => {
        ws.cell(i + 1, j + 1)[_getTypeCell(val)](val)
      })
    })
    await wb.write(filename, res)
  },
}

const _getTypeCell = (value) => typeof value
