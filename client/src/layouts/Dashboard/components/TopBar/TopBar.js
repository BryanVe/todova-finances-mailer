/* eslint-disable no-unused-vars */
import React from "react"
import { Link as RouterLink, useHistory } from "react-router-dom"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import {
  makeStyles,
  AppBar,
  IconButton,
  Toolbar,
  Hidden,
  colors,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"
import clsx from "clsx"

import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded"
import { logoutUser } from "actions"
import { deleteToken } from "lib/helpers"

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
  },
  flexGrow: {
    flexGrow: 1,
  },
  logo: {
    color: colors.grey[50],
    fontSize: "25px",
    fontWeight: 500,
    fontFamily: "Quicksand",
  },
  logoutButton: {
    marginLeft: theme.spacing(1),
  },
}))

const TopBar = ({ onOpenNavBarMobile, className, ...rest }) => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
    deleteToken()
    history.push("/")
  }

  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color='primary'>
      <Toolbar>
        <RouterLink to='/'>
          <h2 className={classes.logo}>TodoVa</h2>
        </RouterLink>
        <div className={classes.flexGrow} />

        <Hidden mdDown>
          <IconButton
            className={classes.logoutButton}
            color='inherit'
            onClick={handleLogout}
          >
            <ExitToAppRoundedIcon className={classes.logoutIcon} />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color='inherit' onClick={onOpenNavBarMobile}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

TopBar.propTypes = {
  onOpenNavBarMobile: PropTypes.func,
  className: PropTypes.string,
}

export default TopBar
