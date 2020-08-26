import { all, fork } from "redux-saga/effects"
import { registerUserSaga, loginUserSaga, authenticateUserSaga } from "./auth"
import { syncDatabaseSaga } from "./configuration"
import {
  generateFilesSaga,
  getAllFilesSaga,
  sendFilesSaga,
  setNotSentFilesSaga,
  getNotSentFilesSaga,
} from "./finances"

function* rootSaga() {
  yield all([
    fork(registerUserSaga),
    fork(loginUserSaga),
    fork(authenticateUserSaga),
    fork(syncDatabaseSaga),
    fork(generateFilesSaga),
    fork(getAllFilesSaga),
    fork(sendFilesSaga),
    fork(setNotSentFilesSaga),
    fork(getNotSentFilesSaga),
  ])
}

export default rootSaga
