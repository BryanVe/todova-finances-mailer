import moment from "moment-timezone"

const OFFSET = "America/Santiago"
const ACCESS_TOKEN = "accessToken"

export const getDateFromMomentObject = (momentObject) => {
  if (!momentObject) return

  return moment
    .tz(momentObject.toISOString(), OFFSET)
    .startOf("day")
    .toISOString()
}

export const formatDate = (date) => {
  return moment.tz(date, OFFSET).format("DD/MM/YYYY")
}

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

// accessToken in localStorage
export const setToken = (token) => localStorage.setItem(ACCESS_TOKEN, token)

export const getToken = () => localStorage.getItem(ACCESS_TOKEN)

export const deleteToken = () => localStorage.removeItem(ACCESS_TOKEN)
