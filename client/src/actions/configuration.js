import { CONFIGURATION_DATABASE_SYNC } from "constants/index"

export const syncDatabaseRequest = () => {
  return {
    type: CONFIGURATION_DATABASE_SYNC.REQUEST,
  }
}
export const syncDatabaseSuccess = () => {
  return {
    type: CONFIGURATION_DATABASE_SYNC.SUCCESS,
  }
}

export const syncDatabaseError = (error) => {
  return {
    type: CONFIGURATION_DATABASE_SYNC.ERROR,
    payload: error,
  }
}
