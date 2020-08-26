module.exports = {
  translateRequestType: (requestType, isConsolidated) => {
    switch (requestType) {
      case "oneway":
        return isConsolidated ? "C" : "I"
      case "roundtrip":
        return "I-V"
    }
    return requestType
  },
  translateMonth: (month) => {
    switch (month) {
      case 0:
        return "Enero"
      case 1:
        return "Febrero"
      case 2:
        return "Marzo"
      case 3:
        return "Abril"
      case 4:
        return "Mayo"
      case 5:
        return "Junio"
      case 6:
        return "Julio"
      case 7:
        return "Agosto"
      case 8:
        return "Septiembre"
      case 9:
        return "Octubre"
      case 10:
        return "Noviembre"
      case 11:
        return "Diciembre"
      default:
        return "Enero"
    }
  },
  translateRequestState: (requestState) => {
    switch (requestState) {
      case "completed":
        return "Completado"
      case "completed_with_return":
        return "C.Retorno"
      case "cancelled_by_customer":
        return "Cancelado"
      case "cancelled_by_driver":
        return "Cancelado"
      case "cancelled_by_todova":
        return "Cancelado"
      case "parkingValue":
        return "Estacionamiento"
      case "waitingTime":
        return "Tiempo"
      case "tollValue":
        return "Peaje"
      case "adjustment":
        return "Ajustes"
      case "schedule":
        return "Disponibilidad"
    }
    return requestState
  },
  formatFloatStr: (float) => {
    let floatChunk = parseFloat(float).toFixed(1).toString().split("."),
      reverseNumber = floatChunk[0].split("").reverse().join(""),
      formatNumber = ""
    const chunk = 3
    for (let i = 0, j = reverseNumber.length; i < j; i += chunk) {
      let numberChunk = reverseNumber.slice(i, i + chunk)
      formatNumber =
        "." + numberChunk.split("").reverse().join("") + formatNumber
    }
    return (
      formatNumber.slice(1, formatNumber.length) +
      (floatChunk[1] !== "0" ? "," + floatChunk[1] : "")
    )
  },
  translateDeliveryType: (deliveryType) => {
    switch (deliveryType) {
      case "walk":
        return "Caminando"
      case "bicycle":
        return "Bicicleta"
      case "motorcycle":
        return "Moto"
      case "car":
        return "Auto"
    }
    return deliveryType
  },
  normalize: (() => {
    let from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnCc",
      mapping = {}

    for (let i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i)

    return function (str) {
      let ret = []
      for (let i = 0, j = str.length; i < j; i++) {
        let c = str.charAt(i)
        if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c])
        else ret.push(c)
      }
      return ret.join("")
    }
  })(),
}
