import React from "react"
import { Typography } from "@material-ui/core"

const Error404 = () => {
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
      <Typography variant='h1'>Not Found</Typography>
    </div>
  )
}

export default Error404
