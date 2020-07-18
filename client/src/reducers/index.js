import { combineReducers } from "redux"
import sessionReducer from "./sessionReducer"
import syncDatabaseReducer from "./syncDatabaseReducer"

const rootReducer = combineReducers({
  session: sessionReducer,
  configuration: syncDatabaseReducer,
})

export default rootReducer
