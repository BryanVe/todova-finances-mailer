import React from "react"
import { Snackbar } from "@material-ui/core"
import MuiAlert from "@material-ui/lab/Alert"
import { useDispatch, useSelector } from "react-redux"
import { hideMessage } from "actions"

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const SnackbarMessage = () => {
  const dispatch = useDispatch()
  const { severity, message, open, options } = useSelector(
    (state) => state.snackbarMessage
  )

  const handleCloseSendFileSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    dispatch(hideMessage())
  }

  return (
    <Snackbar
      anchorOrigin={options.position}
      open={open}
      autoHideDuration={options.duration}
      onClose={handleCloseSendFileSnackbar}
    >
      <Alert onClose={handleCloseSendFileSnackbar} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarMessage
