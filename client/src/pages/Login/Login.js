import React from "react"
import { Link as RouterLink } from "react-router-dom"
import { makeStyles } from "@material-ui/styles"
import { Card, CardContent, Typography, Divider, Link } from "@material-ui/core"
import LockIcon from "@material-ui/icons/Lock"

// import gradients from "utils/gradients"
import { LoginForm } from "./components"

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f2f2f2",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    padding: theme.spacing(8, 4, 3, 4),
  },
  media: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: theme.spacing(3),
    color: theme.palette.white,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  icon: {
    backgroundColor: "green",
    color: theme.palette.white,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    position: "absolute",
    top: -32,
    left: theme.spacing(3),
    height: 64,
    width: 64,
    fontSize: 32,
  },
  loginForm: {
    marginTop: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  person: {
    marginTop: theme.spacing(2),
    display: "flex",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
}))

const Login = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <LockIcon className={classes.icon} />
          <Typography gutterBottom variant='h3'>
            Sign in
          </Typography>
          <Typography variant='subtitle2'>
            Sign in on the internal platform
          </Typography>
          <LoginForm className={classes.loginForm} />
          <Divider className={classes.divider} />
          <Link
            align='center'
            color='secondary'
            component={RouterLink}
            to='/auth/register'
            underline='always'
            variant='subtitle2'
          >
            Don't have an account?
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
