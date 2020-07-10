import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider as StoreProvider } from "react-redux"
import { ThemeProvider } from "@material-ui/core"
import { LocalizationProvider } from "@material-ui/pickers"
import MomentUtils from "@material-ui/pickers/adapter/moment"
import { renderRoutes } from "react-router-config"
import "moment/locale/es-do"

import configureStore from "./configureStore"
import routes from "./routes"
import theme from "./theme"

const store = configureStore()

const App = () => {
  return (
    <LocalizationProvider dateAdapter={MomentUtils} locale='es-do'>
      <StoreProvider store={store}>
        <ThemeProvider theme={theme}>
          <Router>{renderRoutes(routes)}</Router>
        </ThemeProvider>
      </StoreProvider>
    </LocalizationProvider>
  )
}

export default App
