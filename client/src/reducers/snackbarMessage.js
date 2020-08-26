import { MESSAGE } from "constants/index"

const initialState = {
  open: false,
  severity: "",
  message: "",
  options: {},
}

const snackbarMessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE.SHOW:
      return {
        ...state,
        open: true,
        severity: action.payload.severity,
        message: action.payload.message,
        options: action.payload.options,
      }
    case MESSAGE.HIDE:
      return {
        ...state,
        open: false,
      }
    default:
      return state
  }
}

export default snackbarMessageReducer
