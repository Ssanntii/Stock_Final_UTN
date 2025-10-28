import { Router } from "express"
import { User } from '../models/User.mjs'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

export const userRoutes = Router()

userRoutes.get("/", async (req, res) => {

  const users = await User.findAll()

  res.json({
    error: false,
    users
  })

})

// REGISTER
userRoutes.post("/register", async (req, res) => {
  const body = req.body

  try {
    const { full_name, email, password, confirmPassword } = body
    if (password !== confirmPassword) {
      res.status(403).json({
        error: true,
        msg: "Las contraseñas no coinciden"
      })
      return
    }
    
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const activateToken = "123"
    const user = new User({
      full_name,
      email,
      hash,
      activateToken
    })

    await user.save()
    res.json({
      error: false,
      msg: "Usuario creado"
    })

  } catch (err) {
    res.status(400).json({
      error: true,
      msg: err.message
    })
  }

})

// LOGIN
userRoutes.post("/login", async (req, res) => {
  try {
    const body = req.body
    const { email, password } = body

    const user = await User.findOne({
      where: {
        email: email
      }
    })

    if (!user) {
      res.status(404).json({
        error: true,
        msg: "El usuario no existe"
      })
      return
    }

    const checkPasswd = await bcrypt.compare(password, user.hash)

    if (!checkPasswd) {
      res.status(403).json({
        error: true,
        msg: "Contraseña incorrecta"
      })
      return
    }

    const payload = {
      email: email
    }

    const token = jwt.sign(payload, process.env.SECRET)

    res.json({
      error: false,
      user: {
        full_name: user.full_name,
        email: user.email,
        token: `Bearer ${token}`
      }
    })
  } catch {
    res.status(500).json({
      error: true,
      msg: "Hubo un error al iniciar sesion"
    })
  }
})

userRoutes.get("/verify-token", async (req, res) => {
  try{
    const headers = req.headers
    const auth = headers.authorization
    // Bearer token

    if(auth === "") {
      res.json({ error: true })
      return
    }
    const token = auth.split(" ")[1]

    const verify = jwt.verify(token, process.env.SECRET)

    console.log(verify) //Quitar al final

    if (!verify) {
      res.json({ error: true })
      return
    }

    res.json({
      error: false
    })
  } catch {
    res.json({ error : true})
  }
})