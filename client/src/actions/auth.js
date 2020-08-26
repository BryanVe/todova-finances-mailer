import {
  REGISTER_USER,
  LOGIN_USER,
  AUTHENTICATE_USER,
  LOGOUT_USER,
} from "constants/index"

export const registerUserRequest = (newUser, history) => ({
  type: REGISTER_USER.REQUEST,
  payload: { newUser, history },
})

export const registerUserSuccess = (data, message) => ({
  type: REGISTER_USER.SUCCESS,
  payload: { data, message },
})

export const registerUserError = (error) => ({
  type: REGISTER_USER.ERROR,
  payload: error,
})

export const loginUserRequest = (credentials, history) => ({
  type: LOGIN_USER.REQUEST,
  payload: { credentials, history },
})

export const loginUserSuccess = (data, message) => ({
  type: LOGIN_USER.SUCCESS,
  payload: { data, message },
})

export const loginUserError = (error) => ({
  type: LOGIN_USER.ERROR,
  payload: error,
})

export const logoutUser = () => ({
  type: LOGOUT_USER,
})

export const authenticateUserRequest = () => ({
  type: AUTHENTICATE_USER.REQUEST,
})

export const authenticateUserSuccess = (data, message) => ({
  type: AUTHENTICATE_USER.SUCCESS,
  payload: { data, message },
})

export const authenticateUserError = (error) => ({
  type: AUTHENTICATE_USER.ERROR,
  payload: error,
})
