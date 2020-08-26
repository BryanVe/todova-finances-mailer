import * as configuration from "./configuration"
import * as finances from "./finances"
import * as auth from "./auth"
import * as snackbarMessage from "./snackbarMessage"

export const {
  syncDatabaseRequest,
  syncDatabaseSuccess,
  syncDatabaseError,
} = configuration

export const {
  generatePdfFilesRequest,
  generatePdfFilesSuccess,
  generatePdfFilesError,
  getPdfFilesRequest,
  getPdfFilesSuccess,
  getPdfFilesError,
  sendPdfFilesRequest,
  sendPdfFilesSuccess,
  sendPdfFilesError,
  getNotSentPdfFilesError,
  setNotSentPdfFilesError,
  setNotSentPdfFilesSuccess,
  setNotSentPdfFilesRequest,
  getNotSentPdfFilesRequest,
  getNotSentPdfFilesSuccess,
} = finances

export const {
  registerUserRequest,
  registerUserSuccess,
  registerUserError,
  loginUserRequest,
  loginUserSuccess,
  loginUserError,
  logoutUser,
  authenticateUserRequest,
  authenticateUserSuccess,
  authenticateUserError,
} = auth

export const { showMessage, hideMessage } = snackbarMessage
