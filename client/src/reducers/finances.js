import {
  GENERATE_PDF_FILES,
  GET_PDF_FILES,
  SEND_PDF_FILES,
  GET_NOT_SENT_PDF_FILES,
  SET_NOT_SENT_PDF_FILES,
} from "constants/index"

const initialState = {
  pdfFiles: {
    list: [],
    error: null,
    dateGenerated: null,
    notSentFiles: [],
  },
  sendEmailFiles: {
    sended: false,
    error: null,
  },
}
const financesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GENERATE_PDF_FILES.SUCCESS:
      return {
        ...state,
        pdfFiles: {
          ...state.pdfFiles,
          list: action.payload.files,
          error: null,
          dateGenerated: action.payload.dateGenerated,
        },
      }
    case GET_PDF_FILES.SUCCESS:
      return {
        ...state,
        pdfFiles: {
          ...state.pdfFiles,
          list: action.payload.files,
          dateGenerated: action.payload.dateGenerated,
          notSentFiles: action.payload.notSentFiles,
          error: null,
        },
      }
    case SEND_PDF_FILES.SUCCESS:
      return {
        ...state,
        pdfFiles: {
          ...state.pdfFiles,
          list: action.payload.files,
          error: null,
        },
        sendEmailFiles: {
          ...state.sendEmailFiles,
          sended: true,
          error: null,
        },
      }
    case SEND_PDF_FILES.ERROR:
      return {
        ...state,
        sendEmailFiles: {
          ...state.sendEmailFiles,
          sended: false,
          error: action.payload,
        },
      }
    case SET_NOT_SENT_PDF_FILES.REQUEST: {
      if (action.payload.operation === "set")
        return {
          ...state,
          pdfFiles: {
            ...state.pdfFiles,
            notSentFiles: [
              ...state.pdfFiles.notSentFiles,
              action.payload.files[0],
            ],
          },
        }
      if (action.payload.operation === "unset") {
        return {
          ...state,
          pdfFiles: {
            ...state.pdfFiles,
            notSentFiles: state.pdfFiles.notSentFiles.filter(
              (file) => !action.payload.files.includes(file)
            ),
          },
        }
      }
      break
    }
    case GET_NOT_SENT_PDF_FILES.SUCCESS:
      return {
        ...state,
        pdfFiles: {
          ...state.pdfFiles,
          notSentFiles: action.payload,
        },
      }
    case GENERATE_PDF_FILES.ERROR:
    case GET_PDF_FILES.ERROR:
      return {
        ...state,
        pdfFiles: {
          ...state.pdfFiles,
          error: action.payload,
        },
      }
    default:
      return state
  }
}

export default financesReducer
