import moment from "moment-timezone"

export const getDateFromMoment = (momentObject) => {
  if (!momentObject) return

  // set Santiago offset
  return moment
    .tz(momentObject.toISOString(), "America/Santiago")
    .startOf("day")
    .toISOString()
}
