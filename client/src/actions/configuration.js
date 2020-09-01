import { CONFIGURATION_DATABASE_SYNC } from "constants/index"

export const syncDatabaseRequest = () => ({
  type: CONFIGURATION_DATABASE_SYNC.REQUEST,
})

export const syncDatabaseSuccess = () => ({
  type: CONFIGURATION_DATABASE_SYNC.SUCCESS,
})

export const syncDatabaseError = (error) => ({
  type: CONFIGURATION_DATABASE_SYNC.ERROR,
  payload: error,
})
