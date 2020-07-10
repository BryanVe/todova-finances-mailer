import React, { Suspense } from "react"
import { renderRoutes } from "react-router-config"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import { LinearProgress } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  content: {
    height: "100vh",
  },
}))

const Auth = (props) => {
  const { route } = props

  const classes = useStyles()

  return (
    <main className={classes.content}>
      <Suspense fallback={<LinearProgress />}>
        {renderRoutes(route.routes)}
      </Suspense>
    </main>
  )
}

Auth.propTypes = {
  route: PropTypes.object,
}

export default Auth
