import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { BrowserRouter as Router } from "react-router-dom"
import { Provider as StoreProvider } from "react-redux"
import { ThemeProvider } from "@material-ui/core"
import { LocalizationProvider } from "@material-ui/pickers"
import MomentUtils from "@material-ui/pickers/adapter/moment"
import WebFont from "webfontloader"
import "moment/locale/es-do"

import configureStore from "./configureStore"
import theme from "./theme"
import "./index.css"

const locale = "es-do"
const store = configureStore()

WebFont.load({
  google: {
    families: ["Quicksand:400,500", "sans-serif", "Lexend Deca:400"],
  },
})

ReactDOM.render(
  <LocalizationProvider dateAdapter={MomentUtils} locale={locale}>
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </StoreProvider>
  </LocalizationProvider>,

  document.getElementById("root")
)
