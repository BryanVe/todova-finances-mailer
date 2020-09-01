import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"

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

import { useForceUpdate } from "react-custom-hook-use-force-update"
import { syncDatabaseRequest, showMessage } from "actions"
import { apiUrl } from "config/development"
import io from "socket.io-client"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
    padding: theme.spacing(3),
  },
  consoleLogs: {
    padding: 20,
    fontSize: 18,
    backgroundColor: "#58585F",
    color: "#EBEBEC",
    // fontFamily: "Quicksand",
    // fontWeight: 500,
  },
}))

const DatabaseConfig = () => {
  const dispatch = useDispatch()
  const forceUpdate = useForceUpdate()
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isSynchronizing, setIsSynchronizing] = useState(false)
  const [screenLog, setScreenLog] = useState([])

  const openPopper = Boolean(anchorEl)

  const onConfirmSynchronize = () => {
    setIsSynchronizing(true)
    dispatch(syncDatabaseRequest())
    setAnchorEl(null)
  }

  const openConfirmationPopover = (e) => setAnchorEl(e.currentTarget)
  const closeConfirmationPopover = () => setAnchorEl(null)

  useEffect(() => {
    const socket = io(apiUrl)
    socket.on("connect", () => {
      socket.on("database-sync", (successState) => {
        setIsSynchronizing(false)
        if (!successState)
          dispatch(showMessage("error", "Base de datos no se pudo sincronizar"))
        else
          dispatch(
            showMessage("success", "Base de datos sincronizada correctamente")
          )
      })
      socket.on("database-log", (stream) => {
        setIsSynchronizing(true)
        setScreenLog((previousArray) => {
          let currentArray = previousArray
          currentArray.push(stream)
          return currentArray.slice(-25)
        })
        forceUpdate()
      })
    })
    return () => {
      socket.disconnect()
    }
  }, [forceUpdate, dispatch])

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
                  onClick={openConfirmationPopover}
                  fullWidth
                  size='large'
                  variant='contained'
                  color='primary'
                  startIcon={<SyncRoundedIcon />}
                >
                  Sincronizar
                </Button>
                <Popover
                  onClose={closeConfirmationPopover}
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
                        onClick={closeConfirmationPopover}
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
          <pre className={classes.consoleLogs}>
            <code>
              {screenLog.map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

export default DatabaseConfig
