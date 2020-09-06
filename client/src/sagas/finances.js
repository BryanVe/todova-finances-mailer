import { call, put, takeLatest } from "redux-saga/effects"
import {
  GENERATE_PDF_FILES,
  GET_PDF_FILES,
  SEND_PDF_FILES,
  SET_NOT_SENT_PDF_FILES,
  GET_NOT_SENT_PDF_FILES,
} from "constants/index"
import { Post, Get } from "lib/request"
import {
  generatePdfFilesSuccess,
  getPdfFilesSuccess,
  getNotSentPdfFilesSuccess,
  getNotSentPdfFilesError,
  sendPdfFilesSuccess,
  sendPdfFilesError,
} from "actions/finances"
import { showMessage, getPdfFilesError, generatePdfFilesError } from "actions"

function* generateFiles({ payload: { dates, stopLoading } }) {
  try {
    const {
      status,
      message,
      data: { generateDate, files },
    } = yield call(Post, "/finances/pdf-files/generate", dates)
    yield put(generatePdfFilesSuccess(files, generateDate))
    yield put(showMessage(status, message))
    stopLoading()
  } catch (error) {
    const { status, message } = error.response.data
    yield put(generatePdfFilesError(message))
    yield put(showMessage(status, message))
    stopLoading()
  }
}

function* getAllFiles() {
  try {
    const {
      status,
      message,
      data: { generateDate, files, notSentFiles },
    } = yield call(Get, "/finances/pdf-files")
    yield put(getPdfFilesSuccess(files, notSentFiles, generateDate))
    yield put(showMessage(status, message))
  } catch (error) {
    const { status, message } = error.response.data
    yield put(getPdfFilesError(message))
    yield put(showMessage(status, message))
  }
}

function* sendFiles({ payload: { options, stopSendingEmail } }) {
  try {
    const {
      status,
      message,
      data: { files },
    } = yield call(Post, "/finances/pdf-files/send", options)
    yield put(sendPdfFilesSuccess(message, files))
    yield put(showMessage(status, message))
    stopSendingEmail()
  } catch (error) {
    const { status, message } = error.response.data
    yield put(sendPdfFilesError(message))
    yield put(showMessage(status, message))
    stopSendingEmail()
  }
}

function* setNotSentFiles({ payload }) {
  try {
    const { status, message } = yield call(
      Post,
      "/finances/not-sent-files",
      payload
    )
    yield put(showMessage(status, message))
  } catch (error) {
    const { status, message } = error.response.data
    yield put(showMessage(status, message))
  }
}

function* getNotSentFiles() {
  try {
    const {
      status,
      message,
      data: { files },
    } = yield call(Get, "/finances/not-sent-files")
    yield put(getNotSentPdfFilesSuccess(files))
    yield put(showMessage(status, message))
  } catch (error) {
    const { status, message } = error.response.data
    yield put(getNotSentPdfFilesError(message))
    yield put(showMessage(status, message))
  }
}

export function* generateFilesSaga() {
  yield takeLatest(GENERATE_PDF_FILES.REQUEST, generateFiles)
}

export function* getAllFilesSaga() {
  yield takeLatest(GET_PDF_FILES.REQUEST, getAllFiles)
}

export function* sendFilesSaga() {
  yield takeLatest(SEND_PDF_FILES.REQUEST, sendFiles)
}

export function* setNotSentFilesSaga() {
  yield takeLatest(SET_NOT_SENT_PDF_FILES.REQUEST, setNotSentFiles)
}

export function* getNotSentFilesSaga() {
  yield takeLatest(GET_NOT_SENT_PDF_FILES.REQUEST, getNotSentFiles)
}
