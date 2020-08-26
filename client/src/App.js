import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { renderRoutes } from "react-router-config"
import "moment/locale/es-do"

import { authenticateUserRequest } from "actions"
import { SnackbarMessage } from "components"
import routes from "./routes"

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authenticateUserRequest())
  }, [dispatch])

  return (
    <React.Fragment>
      <SnackbarMessage />
      {renderRoutes(routes)}
    </React.Fragment>
  )
}

export default App
