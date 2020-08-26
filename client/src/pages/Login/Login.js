import React from "react"
import { Link as RouterLink, Redirect } from "react-router-dom"
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Divider,
  Link,
} from "@material-ui/core"

import { LoginForm } from "./components"
import { getToken } from "lib/helpers"

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: theme.spacing(0, 2),
  },
  card: {
    width: theme.breakpoints.values.sm,
    maxWidth: "100%",
    overflow: "unset",
    display: "flex",
    position: "relative",
    "& > *": {
      flexGrow: 1,
      flexBasis: "50%",
      width: "50%",
    },
  },
  content: {
    padding: theme.spacing(3, 4, 3, 4),
  },
  loginForm: {
    marginTop: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}))

const Login = () => {
  const classes = useStyles()

  if (getToken()) return <Redirect to='/overview' />

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Card className={classes.card}>
          <CardContent className={classes.content}>
            <Typography variant='h1' style={{ fontFamily: "Lexend Deca" }}>
              Finances Mailer
            </Typography>
            <LoginForm className={classes.loginForm} />
            <Divider className={classes.divider} />
            <Typography>
              ¿No tienes una cuenta?{" "}
              <Link
                color='secondary'
                component={RouterLink}
                to='/auth/register'
                variant='subtitle2'
              >
                Regístrate
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  )
}

export default Login
