import { call, put, takeLatest } from "redux-saga/effects"
import { CONFIGURATION_DATABASE_SYNC } from "constants/index"
import { Post } from "lib/request"
import { syncDatabaseSuccess, syncDatabaseError } from "actions"

function* broadcastLogs() {
  try {
    yield call(Post, "/configuration/database/sync")
    yield put(syncDatabaseSuccess())
  } catch (error) {
    yield put(syncDatabaseError(error.message))
  }
}

export function* syncDatabaseSaga() {
  yield takeLatest(CONFIGURATION_DATABASE_SYNC.REQUEST, broadcastLogs)
}
