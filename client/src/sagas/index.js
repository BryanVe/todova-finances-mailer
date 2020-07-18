import { all, fork } from "redux-saga/effects"
import syncDatabaseSaga from "./syncDatabaseSaga"

function* rootSaga() {
  yield all([fork(syncDatabaseSaga)])
}

export default rootSaga
