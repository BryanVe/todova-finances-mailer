module.exports = {
  getBankCode: (bankName) => {
    switch (bankName) {
      case "BANCO BICE":
        return 28
      case "BANCO CONSORCIO":
        return 55
      case "BANCO CORPBANCA":
        return 27
      case "BANCO DE CHILE-EDWARDS-CREDICHILE":
        return 1
      case "BANCO DEL DESARROLLO":
        return 507
      case "BANCO ESTADO":
        return 12
      case "BANCO FALABELLA":
        return 51
      case "BANCO INTERNACIONAL":
        return 9
      case "BANCO ITAU":
        return 39
      case "BANCO PARIS":
        return 57
      case "BANCO RIPLEY":
        return 53
      case "BANCO SANTANDER-SANTIAGO-BANEFE":
        return 37
      case "BANCO SECURITY":
        return 49
      case "BANCO BBVA":
        return 504
      case "BANCO BCI-TBANC-NOVA":
        return 16
      case "COOPEUCH":
        return 672
      case "HSBC BANK CHILE":
        return 31
      case "BANCO SCOTIABANK":
        return 14
      default:
        return ""
    }
  },
  getRutDigits: (rut) => {
    let n = ""
    for (let i = 0; i < rut.length - 1; i++)
      if (!isNaN(parseInt(rut.charAt(i)))) n += rut.charAt(i)
    return n
  },

  getRutVeriferDigit: (rut) => {
    return rut[rut.length - 1].toUpperCase()
  },

  getDriverSimpleName: (drv) => {
    let firstName = drv.details.firstName.split(" ")[0]
    let lastName = drv.details.lastName.split(" ")[0]
    return firstName + " " + lastName
  },
}
