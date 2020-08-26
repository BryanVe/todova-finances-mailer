import { combineReducers } from "redux"
import configuration from "./configuration"
import finances from "./finances"
import auth from "./auth"
import snackbarMessage from "./snackbarMessage"

const rootReducer = combineReducers({
  configuration,
  finances,
  auth,
  snackbarMessage,
})

export default rootReducer
