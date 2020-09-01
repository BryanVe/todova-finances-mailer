import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  makeStyles,
  CardContent,
  Card,
  Grid,
  TextField,
  Button,
  LinearProgress,
} from "@material-ui/core"
import {
  DateRangePicker,
  DateRangeDelimiter,
  DatePicker,
} from "@material-ui/pickers"
import io from "socket.io-client"
import PictureAsPdfRoundedIcon from "@material-ui/icons/PictureAsPdfRounded"
import AccountBalanceRoundedIcon from "@material-ui/icons/AccountBalanceRounded"

import TableGenerated from "pages/Finances/components/TableGenerated"
import {
  generatePdfFilesRequest,
  getPdfFilesRequest,
  getNotSentPdfFilesRequest,
} from "actions"
import { getDateFromMomentObject } from "lib/helpers"
import { apiUrl } from "config/development"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
    padding: theme.spacing(3),
  },
  excelPaymentButton: {
    position: "fixed",
    zIndex: 200,
    bottom: 0,
  },
}))

const GeneratePDFs = () => {
  const classes = useStyles()
  const [periodTime, setPeriodTime] = useState([null, null])
  const [payDate, setPayDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const pdfFiles = useSelector((state) => state.finances.pdfFiles.list)

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
    const dates = {
      beginDate: getDateFromMomentObject(periodTime[0]),
      endDate: getDateFromMomentObject(periodTime[1]),
      payDate: getDateFromMomentObject(payDate),
    }

    const params = {
      dates,
      stopLoading,
    }

    dispatch(generatePdfFilesRequest(params))
    setLoading(true)
  }

  const stopLoading = () => {
    setLoading(false)
  }

  const getExcelDriversPayment = () => {
    window.open(`${apiUrl}/finances/excel-driver-payment`)
  }

  const handleDateRangeSelector = (date) => {
    setPeriodTime(date)
  }

  const handlePayDateSelector = (date) => {
    setPayDate(date)
  }

  useEffect(() => {
    const socket = io(apiUrl)
    socket.on("pdf-generating", (status) => {
      setLoading(status)
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    dispatch(getPdfFilesRequest())
    dispatch(getNotSentPdfFilesRequest())
  }, [dispatch])

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
                onChange={handleDateRangeSelector}
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
            <Grid item xs={12} md={3}>
              <DatePicker
                label='Fecha de pago'
                showToolbar={false}
                value={payDate}
                onChange={handlePayDateSelector}
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
            <Grid item xs={12} md={pdfFiles.length > 0 && !loading ? 2 : 4}>
              <Button
                disabled={loading ? loading : validateGenerate()}
                fullWidth
                startIcon={<PictureAsPdfRoundedIcon />}
                size='large'
                color='primary'
                variant='contained'
                onClick={generatePdfFiles}
              >
                {loading ? "Generando..." : "Generar"}
              </Button>
            </Grid>
            {pdfFiles.length > 0 && !loading && (
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  startIcon={<AccountBalanceRoundedIcon />}
                  size='large'
                  color='secondary'
                  variant='outlined'
                  onClick={getExcelDriversPayment}
                >
                  Banco
                </Button>
              </Grid>
            )}
          </Grid>
        </CardContent>
        {loading && <LinearProgress />}
      </Card>
      <TableGenerated loading={loading} />
    </div>
  )
}

export default GeneratePDFs
