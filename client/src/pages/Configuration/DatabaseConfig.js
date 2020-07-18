import React, { useState, useEffect } from "react"
import {
  makeStyles,
  Card,
  CardContent,
  Typography,
  Button,
  CardHeader,
  CardActions,
  Popover,
} from "@material-ui/core"

import SyncRoundedIcon from "@material-ui/icons/SyncRounded"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import { useDispatch } from "react-redux"
import { syncDatabaseRequest } from "actions"
import { apiUrl } from "config/development"
import io from "socket.io-client"
import { useForceUpdate } from "react-custom-hook-use-force-update"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
    padding: theme.spacing(3),
  },
}))

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const DatabaseConfig = () => {
  const dispatch = useDispatch()
  const forceUpdate = useForceUpdate()
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isSynchronizing, setIsSynchronizing] = useState(false)
  const [screenLog, setScreenLog] = useState([])
  const [databaseInfoSnack, setDatabaseInfoSnack] = useState({
    open: false,
    message: "Base de datos sincronizada correctamente",
    severity: "success",
  })

  const openPopper = Boolean(anchorEl)

  const onConfirmSynchronize = () => {
    setIsSynchronizing(true)
    dispatch(syncDatabaseRequest())
    setAnchorEl(null)
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setDatabaseInfoSnack((prevState) => ({
      ...prevState,
      open: false,
    }))
  }

  useEffect(() => {
    const socket = io(apiUrl)
    socket.on("database-sync", (successState) => {
      setIsSynchronizing(false)
      if (!successState)
        setDatabaseInfoSnack((prevState) => ({
          ...prevState,
          message: "Base de datos no se pudo sincronizar",
          severity: "error",
          open: true,
        }))
      else
        setDatabaseInfoSnack((prevState) => ({
          ...prevState,
          message: "Base de datos sincronizada correctamente",
          severity: "success",
          open: true,
        }))
    })
    socket.on("database-log", (stream) => {
      setScreenLog((previousArray) => {
        let currentArray = previousArray
        currentArray.push(stream)
        return currentArray.slice(-25)
      })
      forceUpdate()
    })
  }, [forceUpdate])

  return (
    <div className={classes.root}>
      <Card>
        <CardHeader
          title='Base de datos'
          titleTypographyProps={{ variant: "h4" }}
          action={
            isSynchronizing ? (
              <Button size='large' variant='contained' color='primary' disabled>
                Sincronizando...
              </Button>
            ) : (
              <React.Fragment>
                <Button
                  disabled={isSynchronizing}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  fullWidth
                  size='large'
                  variant='contained'
                  color='primary'
                  startIcon={<SyncRoundedIcon />}
                >
                  Sincronizar
                </Button>
                <Popover
                  onClose={() => setAnchorEl(null)}
                  style={{ marginTop: 10 }}
                  open={openPopper}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Card>
                    <CardContent>
                      <Typography>
                        ¿Desea sincronizar con la base de datos remota?
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        size='small'
                        variant='contained'
                        onClick={() => setAnchorEl(null)}
                      >
                        No
                      </Button>
                      <Button
                        fullWidth
                        size='small'
                        variant='contained'
                        color='primary'
                        onClick={onConfirmSynchronize}
                      >
                        Sí
                      </Button>
                    </CardActions>
                  </Card>
                </Popover>
              </React.Fragment>
            )
          }
        />
        <CardContent>
          <div
            style={{
              padding: 20,
              backgroundColor: "#58585F",
              color: "#EBEBEC",
              fontFamily: "Quicksand",
              fontWeight: 500,
            }}
          >
            {screenLog.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={databaseInfoSnack.open}
        autoHideDuration={1200}
        onClose={handleClose}
        message='I love snacks'
      >
        <Alert onClose={handleClose} severity={databaseInfoSnack.severity}>
          {databaseInfoSnack.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default DatabaseConfig
