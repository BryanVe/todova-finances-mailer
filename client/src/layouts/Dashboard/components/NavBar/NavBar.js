import React, { Fragment, useEffect } from "react"
import { useLocation, useHistory } from "react-router-dom"
import PropTypes from "prop-types"
import { useSelector, useDispatch } from "react-redux"
import {
  makeStyles,
  Drawer,
  Divider,
  Paper,
  Avatar,
  Typography,
  Button,
  Hidden,
} from "@material-ui/core"
import clsx from "clsx"

import navigationConfig from "./navigationConfig"
import { logoutUser } from "actions"
import { Navigation } from "components"
import { deleteToken } from "lib/helpers"

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: "auto",
  },
  content: {
    padding: theme.spacing(2),
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "fit-content",
  },
  avatar: {
    width: 60,
    height: 60,
  },
  name: {
    marginTop: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  navigation: {
    marginTop: theme.spacing(2),
  },
}))

const NavBar = ({ openMobile, onMobileClose, className, ...rest }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles()
  const location = useLocation()
  const { email, firstName, lastName } = useSelector(
    (state) => state.auth.session
  )

  const handleLogout = () => {
    dispatch(logoutUser())
    deleteToken()
    history.push("/")
  }

  useEffect(() => {
    if (openMobile) {
      onMobileClose && onMobileClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const navbarContent = (
    <div className={classes.content}>
      <div className={classes.profile}>
        <Avatar alt='Person' className={classes.avatar} />
        <Typography className={classes.name} variant='h4'>
          {firstName} {lastName}
        </Typography>
        <Typography variant='body2'>{email}</Typography>
      </div>
      <Button
        size='small'
        style={{ marginTop: 10 }}
        fullWidth
        variant='outlined'
        color='primary'
        onClick={handleLogout}
      >
        Salir
      </Button>
      <Divider className={classes.divider} />
      <nav className={classes.navigation}>
        {navigationConfig.map((list) => (
          <Navigation
            component='div'
            key={list.title}
            pages={list.pages}
            title={list.title}
          />
        ))}
      </nav>
    </div>
  )

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor='left'
          onClose={onMobileClose}
          open={openMobile}
          variant='temporary'
        >
          <div {...rest} className={clsx(classes.root, className)}>
            {navbarContent}
          </div>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Paper
          {...rest}
          className={clsx(classes.root, className)}
          elevation={1}
          square
        >
          {navbarContent}
        </Paper>
      </Hidden>
    </Fragment>
  )
}

NavBar.propTypes = {
  openMobile: PropTypes.bool,
  onMobileClose: PropTypes.func,
  className: PropTypes.string,
}

export default NavBar
