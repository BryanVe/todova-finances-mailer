import { all, fork } from "redux-saga/effects"
import syncDatabaseSaga from "./syncDatabaseSaga"
import financesSaga from "./finances"

function* rootSaga() {
  yield all([fork(syncDatabaseSaga), fork(financesSaga)])
}

export default rootSaga
