import React, { Suspense } from "react"
import { renderRoutes } from "react-router-config"
import {
  makeStyles,
  LinearProgress,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import { useSelector } from "react-redux"

const useStyles = makeStyles((theme) => ({
  content: {
    height: "100vh",
    backgroundColor: "#673AB7",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}))

const Auth = (props) => {
  const { route } = props
  const classes = useStyles()
  const loadingLogin = useSelector((state) => state.auth.loading)

  return (
    <React.Fragment>
      <main className={classes.content}>
        <Suspense fallback={<LinearProgress />}>
          {renderRoutes(route.routes)}
        </Suspense>
      </main>
      <Backdrop className={classes.backdrop} open={loadingLogin}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </React.Fragment>
  )
}

export default Auth
