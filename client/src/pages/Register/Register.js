import React from "react"
import { useHistory } from "react-router-dom"
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@material-ui/core"
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded"
import { RegisterForm } from "./components"

const useStyles = makeStyles((theme) => ({
  root: {
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
    padding: theme.spacing(3, 4, 3, 4),
  },
  registerForm: {
    marginTop: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}))

const Register = () => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Typography variant='h3' style={{ fontFamily: "Lexend Deca" }}>
            ¡Regístrate!
          </Typography>
          <RegisterForm className={classes.registerForm} />
          <Divider className={classes.divider} />
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            variant='contained'
            color='secondary'
            onClick={() => history.goBack()}
          >
            Volver
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
