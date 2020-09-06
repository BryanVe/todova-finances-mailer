import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"

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
  DialogActions,
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

const downloadOneFile = (email) => {
  window.open(`${apiUrl}/finances/pdf-files/${email}.pdf`)
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
  const [selectedRows, setSelectedRows] = useState([])
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
          dispatch(
            setNotSentPdfFilesRequest({
              files: [`${rowData.email}.pdf`],
              operation: rowData.rememberFlag ? "unset" : "set",
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

  const sendFiles = () => {
    const files = selectedRows.map((email) => getFileNameFromEmail(email))
    const options = {
      files,
      textOptions: dateGenerated,
    }
    dispatch(sendPdfFilesRequest(options, stopSendingEmail))
    setIsSendingEmail(true)
    handleCloseSendDialog()
  }

  const stopSendingEmail = () => {
    setIsSendingEmail(false)
  }

  const handleCloseConfirmSendEmailDialog = () => {
    setOpenConfirmSendEmailDialog(false)
  }

  const handleCloseSendDialog = () => setOpenConfirmSendEmailDialog(false)

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
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={sendFiles} variant='contained' color='primary'>
              Enviar
            </Button>
            <Button onClick={handleCloseSendDialog} color='secondary'>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
        <Backdrop className={classes.backdrop} open={isSendingEmail}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </div>
    )
  )
}

export default TableGenerated
