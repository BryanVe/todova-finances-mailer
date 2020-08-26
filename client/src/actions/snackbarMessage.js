import { MESSAGE } from "constants/index"

export const showMessage = (
  severity,
  message,
  options = {
    position: { vertical: "top", horizontal: "center" },
    duration: 1800,
  }
) => ({
  type: MESSAGE.SHOW,
  payload: { severity, message, options },
})

export const hideMessage = () => ({
  type: MESSAGE.HIDE,
})
