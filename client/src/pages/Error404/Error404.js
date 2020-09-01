import React from "react"
import { useHistory } from "react-router-dom"
import { makeStyles, Typography, Button } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    paddingTop: "10vh",
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
  },
  imageContainer: {
    marginTop: theme.spacing(6),
    display: "flex",
    justifyContent: "center",
  },
  image: {
    maxWidth: "100%",
    width: 560,
    maxHeight: 300,
    height: "auto",
  },
  buttonContainer: {
    marginTop: theme.spacing(6),
    display: "flex",
    justifyContent: "center",
  },
}))

const Error404 = () => {
  const classes = useStyles()
  const history = useHistory()

  const goToHome = () => history.replace("/")

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography align='center' variant='h1'>
        404
      </Typography>
      <Typography align='center' variant='h5'>
        Página no encontrada
      </Typography>
      <div className={classes.buttonContainer}>
        <Button color='primary' variant='outlined' onClick={goToHome}>
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}

export default Error404
