/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react"
import { Link as RouterLink, useHistory } from "react-router-dom"
import clsx from "clsx"
import PropTypes from "prop-types"
import { useDispatch } from "react-redux"
import { makeStyles } from "@material-ui/styles"
import {
  AppBar,
  Badge,
  Button,
  IconButton,
  Toolbar,
  Hidden,
  Input,
  colors,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ClickAwayListener,
} from "@material-ui/core"
import LockIcon from "@material-ui/icons/LockOutlined"
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined"
import InputIcon from "@material-ui/icons/Input"
import MenuIcon from "@material-ui/icons/Menu"
import SearchIcon from "@material-ui/icons/Search"

// import axios from "utils/axios"
// import useRouter from "utils/useRouter"
import { PricingModal, NotificationsPopover } from "components"
// import { logout } from 'actions';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "none",
  },
  flexGrow: {
    flexGrow: 1,
  },
  search: {
    backgroundColor: "rgba(255,255,255, 0.1)",
    borderRadius: 4,
    flexBasis: 300,
    height: 36,
    padding: theme.spacing(0, 2),
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: "inherit",
  },
  searchInput: {
    flexGrow: 1,
    color: "inherit",
    "& input::placeholder": {
      opacity: 1,
      color: "inherit",
    },
  },
  searchPopper: {
    zIndex: theme.zIndex.appBar + 100,
  },
  searchPopperContent: {
    marginTop: theme.spacing(1),
  },
  trialButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.white,
    backgroundColor: colors.green[600],
    "&:hover": {
      backgroundColor: colors.green[900],
    },
  },
  trialIcon: {
    marginRight: theme.spacing(1),
  },
  notificationsButton: {
    marginLeft: theme.spacing(1),
  },
  notificationsBadge: {
    backgroundColor: colors.orange[600],
  },
  logoutButton: {
    marginLeft: theme.spacing(1),
  },
}))

const TopBar = (props) => {
  const { onOpenNavBarMobile, className, ...rest } = props

  const classes = useStyles()
  const history = useHistory()
  const searchRef = useRef(null)
  const dispatch = useDispatch()
  const notificationsRef = useRef(null)
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [openSearchPopover, setOpenSearchPopover] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [notifications, setNotifications] = useState([])
  const [openNotifications, setOpenNotifications] = useState(false)

  useEffect(() => {
    let mounted = true

    // // const fetchNotifications = () => {
    //   axios.get("/api/account/notifications").then((response) => {
    //     if (mounted) {
    //       setNotifications(response.data.notifications)
    //     }
    //   })
    // }

    // fetchNotifications()

    return () => {
      mounted = false
    }
  }, [])

  const handleLogout = () => {
    history.push("/auth/login")
    // dispatch(logout());
  }

  const handlePricingOpen = () => {
    setPricingModalOpen(true)
  }

  const handlePricingClose = () => {
    setPricingModalOpen(false)
  }

  const handleNotificationsOpen = () => {
    setOpenNotifications(true)
  }

  const handleNotificationsClose = () => {
    setOpenNotifications(false)
  }

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)

    if (event.target.value) {
      if (!openSearchPopover) {
        setOpenSearchPopover(true)
      }
    } else {
      setOpenSearchPopover(false)
    }
  }

  const handleSearchPopverClose = () => {
    setOpenSearchPopover(false)
  }

  const popularSearches = [
    "Devias React Dashboard",
    "Devias",
    "Admin Pannel",
    "Project",
    "Pages",
  ]

  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color='primary'>
      <Toolbar>
        <RouterLink to='/'>
          <h2 style={{ color: "#FFF" }}>TodoVa</h2>
        </RouterLink>
        <div className={classes.flexGrow} />

        <Hidden mdDown>
          <IconButton
            className={classes.logoutButton}
            color='inherit'
            onClick={handleLogout}
          >
            <InputIcon className={classes.logoutIcon} />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color='inherit' onClick={onOpenNavBarMobile}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
      {/* <NotificationsPopover
        anchorEl={notificationsRef.current}
        notifications={notifications}
        onClose={handleNotificationsClose}
        open={openNotifications}
      /> */}
    </AppBar>
  )
}

TopBar.propTypes = {
  className: PropTypes.string,
  onOpenNavBarMobile: PropTypes.func,
}

export default TopBar
