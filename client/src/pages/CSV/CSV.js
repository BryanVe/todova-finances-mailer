import React from "react"
import { makeStyles } from "@material-ui/core"

import Options from "./components/Options"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
    padding: theme.spacing(3),
  },
}))

const CSV = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Options />
    </div>
  )
}

export default CSV
