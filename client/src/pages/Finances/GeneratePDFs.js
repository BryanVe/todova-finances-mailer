import React, { useState, useEffect } from "react"
import {
  makeStyles,
  CardContent,
  Card,
  Grid,
  TextField,
  Button,
  CardHeader,
} from "@material-ui/core"

import {
  DateRangePicker,
  DateRangeDelimiter,
  DatePicker,
} from "@material-ui/pickers"

import PictureAsPdfRoundedIcon from "@material-ui/icons/PictureAsPdfRounded"

import { getDateFromMoment } from "lib/helpers"
import { useDispatch } from "react-redux"
import { generatePdfFilesRequest } from "actions"
import { apiUrl } from "config/development"
// import { useForceUpdate } from "react-custom-hook-use-force-update"
import io from "socket.io-client"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
    padding: theme.spacing(3),
  },
}))

const GeneratePDFs = () => {
  const classes = useStyles()

  // to set the dates in order to generate the pdf's
  const [periodTime, setPeriodTime] = useState([null, null])
  const [payDate, setPayDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  // -----
  // const [generating, setGenerating] = useState(false)
  // const [selectedRowKeys, setSelectedRowKeys] = useState([])
  // const [openPoper, setOpenPoper] = useState(false)
  // const [defaultEmail, setDefaultEmail] = useState("finanzas@todova.cl")
  // const [passwordField, setPasswordField] = useState("")

  // const forceUpdate = useForceUpdate()

  const validateGenerate = () => {
    // validate if period dates are not empty
    if (!periodTime[0] || !periodTime[1]) return true

    // validate if pay date is not empty
    if (!payDate) return true

    // validate if pay date is after than final date of period time
    if (!payDate.isAfter(periodTime[1])) return true

    return false
  }

  const generatePdfFiles = () => {
    // const dates = {
    //   beginDate: "2019-07-17T04:00:00.000Z",
    //   endDate: "2019-07-18T04:00:00.000Z",
    //   payDate: "asd123",
    // }

    const dates = {
      beginDate: getDateFromMoment(periodTime[0]),
      endDate: getDateFromMoment(periodTime[1]),
      payDate: getDateFromMoment(payDate),
    }

    dispatch(generatePdfFilesRequest(dates))
  }

  useEffect(() => {
    const socket = io(apiUrl)
    socket.on("pdf-generating", (status) => {
      setLoading(status)
    })
  }, [])

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Grid container spacing={3} alignItems='center'>
            <Grid item xs={12} md={5}>
              <DateRangePicker
                startText='Inicio del período'
                endText='Fin del período'
                value={periodTime}
                onChange={(date) => {
                  setPeriodTime(date)
                }}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField fullWidth {...startProps} helperText='' />
                    <DateRangeDelimiter>
                      <br />
                    </DateRangeDelimiter>
                    <TextField fullWidth {...endProps} helperText='' />
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label='Fecha de pago'
                showToolbar={false}
                value={payDate}
                onChange={(date) => {
                  setPayDate(date)
                }}
                renderInput={(props) => (
                  <TextField
                    fullWidth
                    variant='outlined'
                    {...props}
                    helperText='* Debe ser posterior al período'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                disabled={loading ? loading : validateGenerate()}
                fullWidth
                startIcon={<PictureAsPdfRoundedIcon />}
                size='large'
                color='primary'
                variant='contained'
                onClick={generatePdfFiles}
              >
                Generar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card style={{ marginTop: 24 }}>
        <CardHeader
          title='Total a pagar: 0'
          action={[
            <Button
              key='enviar'
              size='large'
              color='primary'
              variant='contained'
            >
              Enviar
            </Button>,
            <Button
              key='banco'
              size='large'
              color='default'
              variant='contained'
            >
              Banco
            </Button>,
          ]}
        />
        <CardContent></CardContent>
      </Card>
    </div>
  )
}

export default GeneratePDFs
