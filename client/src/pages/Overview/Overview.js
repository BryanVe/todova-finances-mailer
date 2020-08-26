import React from "react"
import { makeStyles, Typography } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
    padding: theme.spacing(3),
  },
}))

const Overview = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant='h2'>Welcome!</Typography>
    </div>
  )
}

export default Overview
