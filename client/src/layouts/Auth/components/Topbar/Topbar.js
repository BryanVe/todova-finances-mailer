import React from "react"
import { Link as RouterLink } from "react-router-dom"
import clsx from "clsx"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import { AppBar, Toolbar } from "@material-ui/core"

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: "none",
  },
}))

const Topbar = (props) => {
  const { className, ...rest } = props

  const classes = useStyles()

  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color='primary'>
      <Toolbar>
        <RouterLink to='/'>
          <h2>TodoVa</h2>
        </RouterLink>
      </Toolbar>
    </AppBar>
  )
}

Topbar.propTypes = {
  className: PropTypes.string,
}

export default Topbar
