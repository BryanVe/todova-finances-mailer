import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"

import MuiAlert from "@material-ui/lab/Alert"
import DoneRoundedIcon from "@material-ui/icons/DoneRounded"
import CloseRoundedIcon from "@material-ui/icons/CloseRounded"
import EmailRoundedIcon from "@material-ui/icons/EmailRounded"
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded"
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone"
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive"

import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Snackbar,
  Backdrop,
  CircularProgress,
  makeStyles,
  Typography,
  Button,
} from "@material-ui/core"

import TableWithIcons from "components/TableWithIcons"
import { formatDate, getFileNameFromEmail } from "lib/helpers"
import { apiUrl } from "config/development"
import {
  sendPdfFilesRequest,
  setNotSentPdfFilesRequest,
} from "actions/finances"
import IconButtonWithTooltip from "components/IconButtonWithTooltip"

const defaultEmail = process.env.REACT_APP_DEFAULT_EMAIL
const sendFileSnackbarOptions = {
  position: { vertical: "top", horizontal: "center" },
  duration: 1800,
}

const downloadOneFile = (email) => {
  window.open(`${apiUrl}/finances/pdf-files/${email}.pdf`)
}

const Alert = (props) => {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}))

const TableGenerated = ({ loading }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [openConfirmSendEmailDialog, setOpenConfirmSendEmailDialog] = useState(
    false
  )
  const [passwordField, setPasswordField] = useState("")
  const [selectedRows, setSelectedRows] = useState([])
  const [sendFileSnackbar, setSendFileSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  })
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const { list: files, dateGenerated, notSentFiles } = useSelector(
    (state) => state.finances.pdfFiles
  )
  const data = files.map(({ email, totalPay, isEmailSended }) => {
    return {
      email,
      totalPay,
      isEmailSended,
      rememberFlag: notSentFiles.includes(getFileNameFromEmail(email)),
    }
  })

  const getActions = (rowData) => {
    const actions = [
      {
        tooltip: "Descargar archivo",
        onClick: () => downloadOneFile(rowData.email),
        icon: <GetAppRoundedIcon color='secondary' />,
      },
      {
        tooltip: "Enviar archivo",
        onClick: () => {
          setSelectedRows([`${rowData.email}`])
          setOpenConfirmSendEmailDialog(true)
        },
        icon: <EmailRoundedIcon color='primary' />,
      },
      {
        tooltip: rowData.rememberFlag
          ? "Remover de la lista de no enviados"
          : "Añadir a la lista de no enviados",
        onClick: () => {
          if (rowData.rememberFlag)
            dispatch(
              setNotSentPdfFilesRequest({
                files: [`${rowData.email}.pdf`],
                operation: "unset",
              })
            )
          else
            dispatch(
              setNotSentPdfFilesRequest({
                files: [`${rowData.email}.pdf`],
                operation: "set",
              })
            )
        },
        icon: rowData.rememberFlag ? (
          <NotificationsActiveIcon color='secondary' />
        ) : (
          <NotificationsNoneIcon color='secondary' />
        ),
      },
    ]

    return actions.map(({ tooltip, icon, onClick }) => (
      <IconButtonWithTooltip
        key={tooltip}
        tooltip={tooltip}
        icon={icon}
        onClick={onClick}
      />
    ))
  }

  const columns = [
    { title: "Email", field: "email" },
    {
      title: "¿Fue enviado?",
      field: "isEmailSended",
      align: "right",

      render: (rowData) =>
        rowData.isEmailSended ? (
          <Chip icon={<DoneRoundedIcon />} label='Enviado' color='primary' />
        ) : (
          <Chip
            icon={<CloseRoundedIcon />}
            label='No enviado'
            color='secondary'
          />
        ),
    },
    {
      title: "Pago total",
      field: "totalPay",
      type: "currency",
    },
    {
      title: "Acciones",
      field: "actions",
      sorting: false,
      align: "center",
      render: getActions,
    },
  ]

  const getTableTitle = () => (
    <Typography variant='h6'>
      {formatDate(dateGenerated.beginDate)} -{" "}
      {formatDate(dateGenerated.endDate)}
    </Typography>
  )

  const sendFiles = (emails) => {
    if (passwordField.length === 0) return

    const files = emails.map((email) => getFileNameFromEmail(email))
    const options = {
      files,
      credentials: {
        user: defaultEmail,
        password: passwordField,
      },
      textOptions: dateGenerated,
    }
    dispatch(sendPdfFilesRequest(options, stopSendingEmail))
    setIsSendingEmail(true)
    setPasswordField("")
  }

  const stopSendingEmail = () => {
    setIsSendingEmail(false)
  }

  const handleCloseSendFileSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSendFileSnackbar((prevState) => ({
      ...prevState,
      open: false,
    }))
  }

  const handleCloseConfirmSendEmailDialog = () => {
    setOpenConfirmSendEmailDialog(false)
  }

  return (
    files.length !== 0 && (
      <div style={{ marginTop: 24 }}>
        <TableWithIcons
          isLoading={loading}
          title={getTableTitle()}
          columns={columns}
          data={data}
          actions={[
            {
              icon: () => <GetAppRoundedIcon color='secondary' />,
              tooltip: "Descargar PDF",
              onClick: (event, data) =>
                data.map(({ email }) => downloadOneFile(email)),
            },
            {
              icon: () => <EmailRoundedIcon color='primary' />,
              tooltip: "Enviar correo",
              onClick: (event, data) => {
                setSelectedRows(data.map((item) => item.email))
                setOpenConfirmSendEmailDialog(true)
              },
            },
          ]}
          options={{
            draggable: false,
            selection: true,
          }}
        />
        <Dialog
          open={openConfirmSendEmailDialog}
          onClose={handleCloseConfirmSendEmailDialog}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>Confirmar envío</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedRows.length > 1
                ? `¿Desea enviar los ${selectedRows.length} archivo(s)
              seleccionado(s)?`
                : "¿Desea enviar este archivo?"}
              . Por favor ingrese su contraseña.
            </DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              id='send-email'
              label='Email'
              type='email'
              fullWidth
              value={defaultEmail}
              disabled
            />
            <TextField
              autoFocus
              margin='dense'
              id='send-password'
              label='Contraseña'
              type='password'
              fullWidth
              onChange={(event) => setPasswordField(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenConfirmSendEmailDialog(false)}
              color='primary'
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                sendFiles(selectedRows)
                setOpenConfirmSendEmailDialog(false)
              }}
              color='primary'
            >
              Enviar
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={sendFileSnackbarOptions.position}
          open={sendFileSnackbar.open}
          autoHideDuration={sendFileSnackbarOptions.duration}
          onClose={handleCloseSendFileSnackbar}
        >
          <Alert
            onClose={handleCloseSendFileSnackbar}
            severity={sendFileSnackbar.severity}
          >
            {sendFileSnackbar.message}
          </Alert>
        </Snackbar>
        <Backdrop className={classes.backdrop} open={isSendingEmail}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </div>
    )
  )
}

export default TableGenerated
