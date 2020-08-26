import React from "react"
import { Tooltip, IconButton } from "@material-ui/core"

const IconButtonWithTooltip = ({ tooltip, onClick, icon }) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={onClick}>{icon}</IconButton>
    </Tooltip>
  )
}

export default IconButtonWithTooltip
