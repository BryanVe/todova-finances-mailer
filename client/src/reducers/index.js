import { combineReducers } from "redux"
import sessionReducer from "./sessionReducer"
import syncDatabaseReducer from "./syncDatabaseReducer"
import finances from "./finances"

const rootReducer = combineReducers({
  session: sessionReducer,
  configuration: syncDatabaseReducer,
  finances,
})

export default rootReducer
