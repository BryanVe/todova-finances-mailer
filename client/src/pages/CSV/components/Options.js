import React, { useState } from "react"
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  makeStyles,
  CardContent,
  Card,
} from "@material-ui/core"
import {
  DateRangePicker,
  DateRangeDelimiter,
  DatePicker,
} from "@material-ui/pickers"
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded"

import { apiUrl } from "config/development"
import { getDateFromMoment } from "lib/helpers"

const useStyles = makeStyles(() => ({
  calendar: {
    width: "auto",
  },
}))

const gridFieldsSpacing = 4

const downloadOptions = [
  {
    label: "Ninguno",
    value: "",
  },
  {
    label: "Envíos",
    value: "shipments",
  },
  {
    label: "Drivers",
    value: "drivers",
  },
  {
    label: "Driver Schedules",
    value: "driverSchedules",
  },
  {
    label: "Clientes App",
    value: "customers",
  },
  {
    label: "Empresas",
    value: "enterprises",
  },
]

const dateRangeOptions = [
  {
    label: "Todo",
    value: "all",
  },
  {
    label: "Una fecha",
    value: "one",
  },
  {
    label: "Rango de fechas",
    value: "interval",
  },
]

const Options = () => {
  const classes = useStyles()
  const [dateRange, setDateRange] = useState("all")
  const [dateParams, setDateParams] = useState(null)
  const [momentInstance, setMomentInstance] = useState([null, null])
  const [currentOptionSelected, setCurrentOptionSelected] = useState(
    downloadOptions[0]
  )

  const validateDownload = (value) => {
    // validate the value
    if (value === "") return true

    // validate the current date range
    switch (dateRange) {
      case "one": {
        if (!momentInstance[0]) return true
        return false
      }
      case "interval": {
        if (!momentInstance[0] || !momentInstance[1]) return true
        return false
      }
      case "all":
      default:
        return false
    }
  }

  // get date range component and set the md breakpoint to the download selector
  const getDateRangeComponent = (dateRange) => {
    let component = null
    let downloadSelectorMd = 8
    switch (dateRange) {
      case "one": {
        component = (
          <Grid item md={3} xs={12}>
            <DatePicker
              label='Fecha seleccionada'
              showToolbar={false}
              value={momentInstance[0]}
              onChange={(date) => {
                setMomentInstance([date, null])
                setDateParams({
                  date: getDateFromMoment(date),
                })
              }}
              renderInput={(props) => (
                <TextField
                  fullWidth
                  variant='outlined'
                  {...props}
                  helperText=''
                />
              )}
            />
          </Grid>
        )

        // change the size of download selector
        downloadSelectorMd = 5
        break
      }
      case "interval": {
        component = (
          <Grid item md={5} xs={12}>
            <DateRangePicker
              startText='Inicio'
              endText='Final'
              value={momentInstance}
              onChange={(date) => {
                setMomentInstance(date)
                setDateParams({
                  startDate: getDateFromMoment(date[0]),
                  endDate: getDateFromMoment(date[1]),
                })
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
        )

        // change the size of download selector
        downloadSelectorMd = 3
        break
      }
      default:
        break
    }

    return { component, downloadSelectorMd }
  }

  // handle when the period of time selector is shown
  const showPeriodOfTimeField = (value) => {
    if (value !== "")
      return (
        <React.Fragment>
          <Grid item md={2} xs={12}>
            <FormControl
              fullWidth
              variant='outlined'
              className={classes.formControl}
            >
              <InputLabel>Período</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                label='Período'
              >
                {dateRangeOptions.map(({ label, value }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* date range picker */}
          {getDateRangeComponent(dateRange).component}
        </React.Fragment>
      )
  }

  const downloadResource = () => {
    const params = encodeURIComponent(JSON.stringify(dateParams))
    window.open(
      `${apiUrl}/${currentOptionSelected.value}/download?period=${dateRange}&params=${params}`
    )
  }

  const resetPeriodOfTime = () => {
    setDateRange("all")
    setMomentInstance([null, null])
    setDateParams(null)
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={gridFieldsSpacing} alignItems='center'>
          {/* download options selector */}
          <Grid
            item
            md={
              currentOptionSelected.value !== ""
                ? getDateRangeComponent(dateRange).downloadSelectorMd
                : 10
            }
            xs={12}
          >
            <FormControl
              fullWidth
              variant='outlined'
              className={classes.formControl}
            >
              <InputLabel>¿Qué deseas descargar?</InputLabel>
              <Select
                value={currentOptionSelected.value}
                onChange={(e) => {
                  setCurrentOptionSelected(
                    downloadOptions.find(
                      ({ value }) => value === e.target.value
                    )
                  )
                }}
                label='¿Qué deseas descargar?'
              >
                {downloadOptions.map(({ label, value }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* show the period selector */}
          {showPeriodOfTimeField(currentOptionSelected.value)}

          {/* the download button */}
          <Grid item md={2} xs={12}>
            <Button
              disabled={validateDownload(currentOptionSelected.value)}
              fullWidth
              startIcon={<GetAppRoundedIcon />}
              size='large'
              color='primary'
              variant='contained'
              onClick={() => {
                downloadResource()
                resetPeriodOfTime()
              }}
            >
              Descargar
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Options
