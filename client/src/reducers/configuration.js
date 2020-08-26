import { CONFIGURATION_DATABASE_SYNC } from "constants/index"

const initialState = {
  database: {
    error: null,
  },
}

const configurationReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONFIGURATION_DATABASE_SYNC.SUCCESS:
      return {
        ...state,
        database: {
          ...state.database,
          error: null,
        },
      }
    case CONFIGURATION_DATABASE_SYNC.ERROR:
      return {
        ...state,
        database: {
          ...state.database,
          error: action.payload,
        },
      }
    default:
      return state
  }
}

export default configurationReducer
