export const getEmailFromFileName = (fileName) => {
  return fileName.split(".pdf")[0]
}

export const getFileNameFromEmail = (email) => {
  return `${email}.pdf`
}

export const formatFloatStr = (float) => {
  let floatChunk = parseFloat(float).toFixed(1).toString().split("."),
    reverseNumber = floatChunk[0].split("").reverse().join(""),
    formatNumber = ""
  const chunk = 3
  for (let i = 0, j = reverseNumber.length; i < j; i += chunk) {
    let numberChunk = reverseNumber.slice(i, i + chunk)
    formatNumber = "." + numberChunk.split("").reverse().join("") + formatNumber
  }
  return (
    formatNumber.slice(1, formatNumber.length) +
    (floatChunk[1] !== "0" ? "," + floatChunk[1] : "")
  )
}
