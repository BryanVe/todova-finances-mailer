import { GENERATE_PDF_FILES } from "constants/index"

export const generatePdfFilesRequest = (dates) => {
  return {
    type: GENERATE_PDF_FILES.REQUEST,
    payload: dates,
  }
}
export const generatePdfFilesSuccess = (files) => {
  return {
    type: GENERATE_PDF_FILES.SUCCESS,
    payload: files,
  }
}

export const generatePdfFilesError = (error) => {
  return {
    type: GENERATE_PDF_FILES.ERROR,
    payload: error,
  }
}
