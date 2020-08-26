import React from "react"
import { Typography } from "@material-ui/core"

const Error401 = () => {
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
      <Typography variant='h1'>Unauthorized</Typography>
    </div>
  )
}

export default Error401
