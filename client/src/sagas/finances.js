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
} from "actions/finances"
import { showMessage, getPdfFilesError, generatePdfFilesError } from "actions"

function* generateFiles({ payload: { dates, stopLoading } }) {
  try {
    const { data, generateDate } = yield call(
      Post,
      "/finances/pdf-files/generate",
      dates
    )
    yield put(generatePdfFilesSuccess(data, generateDate))
    yield put(showMessage("success", "Archivos generados correctamente"))
    stopLoading()
  } catch (error) {
    yield put(generatePdfFilesError(error.message))
    yield put(showMessage("error", "Ocurrió un error al generar los archivos"))
    stopLoading()
  }
}

function* getAllFiles() {
  try {
    const { data, generateDate } = yield call(Get, "/finances/pdf-files")
    yield put(getPdfFilesSuccess(data, generateDate))
    yield put(showMessage("success", "Archivos cargados correctamente"))
  } catch (error) {
    yield put(getPdfFilesError(error.message))
    yield put(showMessage("error", "Ocurrió un error al cargar los archivos"))
  }
}

function* sendFiles({ payload: { options, stopSendingEmail } }) {
  try {
    const { status, message } = yield call(
      Post,
      "/finances/pdf-files/send",
      options
    )
    yield getAllFiles()
    yield put(showMessage(status, message))
    stopSendingEmail()
  } catch (error) {
    const { status, message } = error.response.data
    yield put(showMessage(status, message))
    stopSendingEmail()
  }
}

function* setNotSentFiles({ payload }) {
  try {
    yield call(Post, "/finances/not-sent-files", payload)
  } catch (error) {
    yield put(
      showMessage(
        "error",
        "Ocurrió un error al intentar añadir/remover a la lista de no enviados"
      )
    )
  }
}

function* getNotSentFiles() {
  try {
    const data = yield call(Get, "/finances/not-sent-files")
    yield put(getNotSentPdfFilesSuccess(data))
  } catch (error) {
    yield put(getNotSentPdfFilesError(error.message))
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
