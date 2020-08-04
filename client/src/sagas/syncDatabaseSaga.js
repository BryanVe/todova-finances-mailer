import { call, put, takeLatest } from "redux-saga/effects"
import { CONFIGURATION_DATABASE_SYNC } from "constants/index"
import { Post } from "lib/Request"
import { syncDatabaseSuccess } from "actions/configuration"

function* broadcastLogs() {
  try {
    yield call(Post, "/configuration/database/sync")
    yield put(syncDatabaseSuccess())
  } catch (error) {
    console.log(error)
  }
}

export default function* syncDatabaseSaga() {
  yield takeLatest(CONFIGURATION_DATABASE_SYNC.REQUEST, broadcastLogs)
}
