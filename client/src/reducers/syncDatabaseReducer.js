import { CONFIGURATION_DATABASE_SYNC } from "constants/index"

const initialState = {
  database: {
    error: null,
  },
}

const syncDatabaseReducer = (state = initialState, action) => {
  switch (action) {
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
          error: action.error,
        },
      }
    default:
      return state
  }
}

export default syncDatabaseReducer
