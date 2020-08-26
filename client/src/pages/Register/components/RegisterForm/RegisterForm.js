/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react"
import validate from "validate.js"
import clsx from "clsx"
import { makeStyles } from "@material-ui/styles"
import { Button, TextField } from "@material-ui/core"

import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { registerUserRequest } from "actions/auth"

const schema = {
  email: {
    presence: { allowEmpty: false, message: "is required" },
    email: true,
  },
  password: {
    presence: { allowEmpty: false, message: "is required" },
    length: {
      minimum: 6,
      tooShort: "needs to have %{count} words or more",
    },
  },
  firstName: {
    presence: { allowEmpty: false, message: "is required" },
  },
  lastName: {
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

const RegisterForm = (props) => {
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
    dispatch(registerUserRequest(formState.values, history))
  }

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false

  return (
    <React.Fragment>
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
            error={hasError("firstName")}
            fullWidth
            helperText={
              hasError("firstName") ? formState.errors.firstName[0] : null
            }
            label='Nombres'
            name='firstName'
            onChange={handleChange}
            value={formState.values.firstName || ""}
            variant='outlined'
          />
          <TextField
            error={hasError("lastName")}
            fullWidth
            helperText={
              hasError("lastName") ? formState.errors.lastName[0] : null
            }
            label='Apellidos'
            name='lastName'
            onChange={handleChange}
            value={formState.values.lastName || ""}
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
          color='primary'
          disabled={!formState.isValid}
          size='large'
          type='submit'
          variant='contained'
        >
          Registrarse
        </Button>
      </form>
    </React.Fragment>
  )
}

export default RegisterForm
