import React from "react"
import { Typography } from "@material-ui/core"

const Error500 = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant='h1'>Internal Server Error</Typography>
    </div>
  )
}

export default Error500
