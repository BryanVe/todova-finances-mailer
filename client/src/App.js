import React from "react"
import moment from "moment-timezone"

const App = () => {
  return (
    <h1>
      {console.log(
        moment.tz("2020-06-26", "America/Lima").endOf("day").format()
      )}
      App running
    </h1>
  )
}

export default App
