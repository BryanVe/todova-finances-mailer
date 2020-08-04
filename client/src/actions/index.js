import * as configuration from "actions/configuration"
import * as pdfFiles from "actions/finances"

export const {
  syncDatabaseRequest,
  syncDatabaseSuccess,
  syncDatabaseError,
} = configuration

export const {
  generatePdfFilesRequest,
  generatePdfFilesSuccess,
  generatePdfFilesError,
} = pdfFiles
