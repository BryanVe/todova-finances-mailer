import React from "react"
import PropTypes from "prop-types"
import { Tooltip, IconButton } from "@material-ui/core"

const IconButtonWithTooltip = ({ tooltip, onClick, icon }) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={onClick}>{icon}</IconButton>
    </Tooltip>
  )
}

IconButtonWithTooltip.propTypes = {
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node,
}

export default IconButtonWithTooltip
