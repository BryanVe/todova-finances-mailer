import { GENERATE_PDF_FILES } from "constants/index"

const initialState = {
  pdfFiles: {
    list: [],
    info: {},
    error: null,
    params: null,
    restricted: [],
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
          list: action.payload,
          error: null,
          params: null,
        },
      }
    case GENERATE_PDF_FILES.ERROR:
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
