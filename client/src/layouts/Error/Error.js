import React, { Suspense } from "react"
import { renderRoutes } from "react-router-config"
import { makeStyles, LinearProgress } from "@material-ui/core"

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
}))

const Error = (props) => {
  const { route } = props

  const classes = useStyles()

  return (
    <main className={classes.root}>
      <Suspense fallback={<LinearProgress />}>
        {renderRoutes(route.routes)}
      </Suspense>
    </main>
  )
}

export default Error
