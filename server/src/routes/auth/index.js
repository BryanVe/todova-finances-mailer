const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../../models/User")
const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET)
}

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token === "null")
      return res.status(401).json({
        status: "error",
        message: "No se recibió un token",
        data: {},
      })
    const { id } = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.userId = id
    next()
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "El token recibido expiró",
      data: {},
    })
  }
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user)
      return res.status(404).json({
        status: "error",
        message: "El email ingresado es incorrecto",
        data: {},
      })

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword)
      return res.status(404).json({
        status: "error",
        message: "La contraseña ingresada es incorrecta",
        data: {},
      })

    let accessToken = generateAccessToken({ id: user._id })

    res.status(200).json({
      status: "success",
      message: "El usuario se logueó satisfactoriamente",
      accessToken,
      data: {
        email: user.email,
        lastName: user.lastName,
        firstName: user.firstName,
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: "error",
      message: "El usuario no pudo loguearse",
      data: {},
    })
  }
})

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body
    const isUserExist = await User.findOne({ email })

    if (isUserExist)
      return res.status(400).json({
        status: "error",
        message: "El email ingresado ya existe",
        data: {},
      })

    const newUser = new User({
      email,
      firstName,
      lastName,
    })
    newUser.password = await newUser.hashPassword(password)

    await newUser.save()
    let accessToken = generateAccessToken({ id: newUser._id })
    res.status(201).json({
      status: "success",
      message: "El usuario se registró satisfactoriamente",
      accessToken,
      data: {
        email: newUser.email,
        lastName: newUser.lastName,
        firstName: newUser.firstName,
      },
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: "error",
      message: "El usuario no pudo registrarse",
      data: {},
    })
  }
})

router.get("/whoami", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId, {
      password: 0,
      __v: 0,
      _id: 0,
    })
    if (!user)
      return res.status(404).json({
        status: "error",
        message: "El usuario no pudo ser encontrado",
        data: {},
      })

    res.status(200).json({
      status: "success",
      message: "El usuario fue autenticado exitósamente",
      data: user,
    })
  } catch (error) {
    console.log(error)
    return res.send(500).json({
      status: "error",
      message: "El usuario no pudo ser autenticado",
      data: {},
    })
  }
})

module.exports = router
