import React, { useEffect } from "react"
import { makeStyles, IconButton, Tooltip } from "@material-ui/core"
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded"
import { useSelector, useDispatch } from "react-redux"

import TableWithIcons from "components/TableWithIcons"
import {
  setNotSentPdfFilesRequest,
  getNotSentPdfFilesRequest,
} from "actions/finances"

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "0 auto",
    padding: theme.spacing(3),
  },
}))

const NotSentFiles = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const notSentFiles = useSelector(
    (state) => state.finances.pdfFiles.notSentFiles
  )
  const data = notSentFiles.map((fileName) => ({
    email: fileName.split(".pdf")[0],
  }))

  useEffect(() => {
    dispatch(getNotSentPdfFilesRequest())
  }, [dispatch])

  const columns = [
    { title: "Email", field: "email", align: "right" },
    {
      title: "Acciones",
      field: "actions",
      sorting: false,
      align: "center",
      render: (rowData) => (
        <React.Fragment>
          <Tooltip title='Remover de la lista de no enviados'>
            <IconButton
              onClick={() => {
                dispatch(
                  setNotSentPdfFilesRequest({
                    files: [`${rowData.email}.pdf`],
                    operation: "unset",
                  })
                )
              }}
            >
              <DeleteRoundedIcon color='primary' />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      ),
    },
  ]

  return (
    <div className={classes.root}>
      <TableWithIcons
        title=''
        columns={columns}
        data={data}
        actions={[
          {
            icon: () => <DeleteRoundedIcon color='primary' />,
            tooltip: "Remover de la lista de no enviados",
            onClick: (event, data) => {
              dispatch(
                setNotSentPdfFilesRequest({
                  files: data.map((element) => `${element.email}.pdf`),
                  operation: "unset",
                })
              )
            },
          },
        ]}
        options={{
          draggable: false,
          selection: true,
        }}
      />
    </div>
  )
}

export default NotSentFiles
