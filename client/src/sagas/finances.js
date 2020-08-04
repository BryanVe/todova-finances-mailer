import { call, put, takeLatest } from "redux-saga/effects"
import { GENERATE_PDF_FILES } from "constants/index"
import { Post } from "lib/Request"
import { generatePdfFilesSuccess } from "actions/finances"

function* generatePdfFiles({ payload }) {
  try {
    const { files } = yield call(Post, "/finances/generate/pdf-files", payload)
    yield put(generatePdfFilesSuccess(files))
  } catch (error) {
    console.log(error)
  }
}

export default function* saga() {
  yield takeLatest(GENERATE_PDF_FILES.REQUEST, generatePdfFiles)
}
