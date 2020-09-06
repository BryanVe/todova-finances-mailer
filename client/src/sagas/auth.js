import { call, put, takeLatest } from "redux-saga/effects"
import { REGISTER_USER, LOGIN_USER, AUTHENTICATE_USER } from "constants/index"
import { Post, Get } from "lib/request"
import { setToken, getToken } from "lib/helpers"
import {
  registerUserError,
  registerUserSuccess,
  loginUserSuccess,
  loginUserError,
  authenticateUserSuccess,
  authenticateUserError,
  showMessage,
} from "actions"

function* registerUser({ payload: { newUser, history } }) {
  try {
    const { status, message, accessToken, data } = yield call(
      Post,
      "/auth/register",
      newUser
    )
    yield put(registerUserSuccess(data, message))
    setToken(accessToken)
    history.push("/csv/download")
    yield put(
      showMessage(status, message, {
        position: { vertical: "bottom", horizontal: "left" },
        duration: 1800,
      })
    )
  } catch (error) {
    const { status, message } = error.response.data

    yield put(registerUserError(message))
    yield put(
      showMessage(status, message, {
        position: { vertical: "bottom", horizontal: "left" },
        duration: 1800,
      })
    )
  }
}

function* loginUser({ payload: { credentials, history } }) {
  try {
    const { status, message, accessToken, data } = yield call(
      Post,
      "/auth/login",
      credentials
    )
    yield put(loginUserSuccess(data, message))
    setToken(accessToken)
    history.push("/csv/download")
    yield put(
      showMessage(status, message, {
        position: { vertical: "bottom", horizontal: "left" },
        duration: 1800,
      })
    )
  } catch (error) {
    const { status, message } = error.response.data
    yield put(loginUserError(message))
    yield put(
      showMessage(status, message, {
        position: { vertical: "bottom", horizontal: "left" },
        duration: 1800,
      })
    )
  }
}

function* authenticateUser() {
  try {
    const accessToken = getToken()
    const { message, data } = yield call(
      Get,
      "/auth/whoami",
      {},
      { authorization: `Bearer ${accessToken}` }
    )
    yield put(authenticateUserSuccess(data, message))
  } catch (error) {
    const { message } = error.response.data
    yield put(authenticateUserError(message))
  }
}

export function* registerUserSaga() {
  yield takeLatest(REGISTER_USER.REQUEST, registerUser)
}

export function* loginUserSaga() {
  yield takeLatest(LOGIN_USER.REQUEST, loginUser)
}

export function* authenticateUserSaga() {
  yield takeLatest(AUTHENTICATE_USER.REQUEST, authenticateUser)
}
