import { SESSION_LOGIN, SESSION_LOGOUT } from "../constants"
import userImage from "assets/images/user.png"

const initialState = {
  loggedIn: true,
  user: {
    first_name: "Juan",
    last_name: "Perez",
    email: "juan@perez.com",
    avatar: userImage,
    bio: "Brain Director",
    role: "ADMIN", // ['GUEST', 'USER', 'ADMIN']
  },
}

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SESSION_LOGIN: {
      return {
        ...initialState,
      }
    }

    case SESSION_LOGOUT: {
      return {
        ...state,
        loggedIn: false,
        user: {
          role: "GUEST",
        },
      }
    }

    default: {
      return state
    }
  }
}

export default sessionReducer
