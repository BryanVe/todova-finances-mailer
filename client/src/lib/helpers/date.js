import moment from "moment-timezone"

const OFFSET = "America/Santiago"

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
