/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"
import validate from "validate.js"
import clsx from "clsx"
import { makeStyles } from "@material-ui/styles"
import { Button, TextField } from "@material-ui/core"

import { useHistory } from "react-router-dom"
import { loginUserRequest } from "actions"
import { useDispatch } from "react-redux"

const schema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
  },
  password: {
    presence: { allowEmpty: false, message: "is required" },
  },
}

const useStyles = makeStyles((theme) => ({
  root: {},
  fields: {
    margin: theme.spacing(-1),
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      flexGrow: 1,
      margin: theme.spacing(1),
    },
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: "100%",
  },
}))

const LoginForm = (props) => {
  const { className, ...rest } = props
  const dispatch = useDispatch()
  const classes = useStyles()
  const history = useHistory()
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  })

  useEffect(() => {
    const errors = validate(formState.values, schema)
    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }))
  }, [formState.values])

  const handleChange = (event) => {
    event.persist()

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(loginUserRequest(formState.values, history))
  }

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false

  return (
    <form
      {...rest}
      className={clsx(classes.root, className)}
      onSubmit={handleSubmit}
    >
      <div className={classes.fields}>
        <TextField
          autoFocus
          error={hasError("email")}
          fullWidth
          helperText={hasError("email") ? formState.errors.email[0] : null}
          label='Email'
          name='email'
          onChange={handleChange}
          value={formState.values.email || ""}
          variant='outlined'
        />
        <TextField
          error={hasError("password")}
          fullWidth
          helperText={
            hasError("password") ? formState.errors.password[0] : null
          }
          label='Contraseña'
          name='password'
          onChange={handleChange}
          type='password'
          value={formState.values.password || ""}
          variant='outlined'
        />
      </div>
      <Button
        className={classes.submitButton}
        color='secondary'
        disabled={!formState.isValid}
        size='large'
        type='submit'
        variant='contained'
      >
        Ingresar
      </Button>
    </form>
  )
}

export default LoginForm
