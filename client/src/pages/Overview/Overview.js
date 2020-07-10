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

  // if (true) return <Redirect to='/auth/login' />

  return (
    <div className={classes.root}>
      <Typography variant='h1'>Welcome!</Typography>
    </div>
  )
}

export default Overview
