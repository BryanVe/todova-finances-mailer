import {
  REGISTER_USER,
  LOGIN_USER,
  AUTHENTICATE_USER,
  LOGOUT_USER,
} from "constants/index"

const initialState = {
  loading: false,
  status: false,
  session: {},
  message: "",
  error: "",
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER.REQUEST:
    case LOGIN_USER.REQUEST:
    case AUTHENTICATE_USER.REQUEST:
      return {
        ...state,
        loading: true,
      }
    case REGISTER_USER.SUCCESS:
    case LOGIN_USER.SUCCESS:
    case AUTHENTICATE_USER.SUCCESS:
      return {
        ...state,
        loading: false,
        status: true,
        session: action.payload.data,
        message: action.payload.message,
        error: "",
      }
    case REGISTER_USER.ERROR:
    case LOGIN_USER.ERROR:
    case AUTHENTICATE_USER.ERROR:
      return {
        ...state,
        loading: false,
        status: false,
        session: {},
        message: "",
        error: action.payload,
      }
    case LOGOUT_USER:
      return initialState
    default:
      return state
  }
}

export default authReducer
