import {
  GENERATE_PDF_FILES,
  GET_PDF_FILES,
  SEND_PDF_FILES,
  GET_NOT_SENT_PDF_FILES,
  SET_NOT_SENT_PDF_FILES,
} from "constants/index"

export const generatePdfFilesRequest = (params) => ({
  type: GENERATE_PDF_FILES.REQUEST,
  payload: params,
})

export const generatePdfFilesSuccess = (files, dateGenerated) => ({
  type: GENERATE_PDF_FILES.SUCCESS,
  payload: { files, dateGenerated },
})

export const generatePdfFilesError = (error) => ({
  type: GENERATE_PDF_FILES.ERROR,
  payload: error,
})

export const getPdfFilesRequest = () => ({
  type: GET_PDF_FILES.REQUEST,
})

export const getPdfFilesSuccess = (files, notSentFiles, dateGenerated) => ({
  type: GET_PDF_FILES.SUCCESS,
  payload: { files, notSentFiles, dateGenerated },
})

export const getPdfFilesError = (error) => ({
  type: GET_PDF_FILES.ERROR,
  payload: error,
})

export const sendPdfFilesRequest = (options, stopSendingEmail) => ({
  type: SEND_PDF_FILES.REQUEST,
  payload: { options, stopSendingEmail },
})

export const sendPdfFilesSuccess = (message, files) => ({
  type: SEND_PDF_FILES.SUCCESS,
  payload: { message, files },
})

export const sendPdfFilesError = (error) => ({
  type: SEND_PDF_FILES.ERROR,
  payload: error,
})

export const setNotSentPdfFilesRequest = (params) => ({
  type: SET_NOT_SENT_PDF_FILES.REQUEST,
  payload: params,
})

export const setNotSentPdfFilesSuccess = (message) => ({
  type: SET_NOT_SENT_PDF_FILES.SUCCESS,
  payload: message,
})

export const setNotSentPdfFilesError = (error) => ({
  type: SET_NOT_SENT_PDF_FILES.ERROR,
  payload: error,
})

export const getNotSentPdfFilesRequest = () => ({
  type: GET_NOT_SENT_PDF_FILES.REQUEST,
})

export const getNotSentPdfFilesSuccess = (files) => ({
  type: GET_NOT_SENT_PDF_FILES.SUCCESS,
  payload: files,
})

export const getNotSentPdfFilesError = (error) => ({
  type: GET_NOT_SENT_PDF_FILES.ERROR,
  payload: error,
})
