import { Router } from "express"
import { User } from '../models/User.mjs'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { validateUserRegister, validateUserLogin } from '../middleware/validation.mjs'
import { authenticateToken } from '../middleware/auth.mjs'
import { uploadProfilePicture } from '../config/multer.mjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const userRoutes = Router()

// Ruta REGISTER (con validaciones)
userRoutes.post("/register", validateUserRegister, async (req, res) => {
  try {
    const { full_name, email, password } = req.body

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(409).json({
        error: true,
        msg: "Ya existe un usuario registrado con ese email"
      })
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // Crear usuario
    const user = new User({
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      hash,
      activateToken: "123"
    })

    await user.save()
    
    res.json({ 
      error: false, 
      msg: "Usuario creado exitosamente" 
    })

  } catch (err) {
    console.error('Error en registro:', err)
    res.status(400).json({
      error: true,
      msg: err.message
    })
  }
})

// Ruta LOGIN (con validaciones)
userRoutes.post("/login", validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario
    const user = await User.findOne({
      where: {
        email: email.toLowerCase().trim()
      }
    })

    if (!user) {
      return res.status(404).json({
        error: true,
        msg: "El usuario no existe"
      })
    }

    // Verificar contraseña
    const checkPasswd = await bcrypt.compare(password, user.hash)

    if (!checkPasswd) {
      return res.status(403).json({
        error: true,
        msg: "Contraseña incorrecta"
      })
    }

    // Crear token
    const payload = {
      email: user.email
    }

    const token = jwt.sign(payload, process.env.SECRET)

    res.json({
      error: false,
      user: {
        full_name: user.full_name,
        email: user.email,
        profile_picture: user.profile_picture,
        token: token
      }
    })
  } catch (err) {
    console.error('Error en login:', err)
    res.status(500).json({
      error: true,
      msg: "Hubo un error al iniciar sesión"
    })
  }
})

// Ruta para verificar token (protegida)
userRoutes.get("/verify-token", authenticateToken, async (req, res) => {
  try {
    // Si llegamos aquí, el token es válido (gracias al middleware)
    res.json({
      error: false,
      msg: "Token válido",
      user: {
        id: req.user.id,
        full_name: req.user.full_name,
        email: req.user.email,
        profile_picture: req.user.profile_picture
      }
    })
  } catch (err) {
    console.error('Error en verificación:', err)
    res.status(500).json({ 
      error: true,
      msg: "Error al verificar token"
    })
  }
})

// Ruta para actualizar perfil del usuario (protegida)
userRoutes.put("/update", authenticateToken, uploadProfilePicture.single('profile_picture'), async (req, res) => {
  try {
    const { full_name, current_password, new_password } = req.body

    // Buscar usuario
    const user = await User.findOne({ where: { email: req.user.email } })

    if (!user) {
      return res.status(404).json({
        error: true,
        msg: "Usuario no encontrado"
      })
    }

    // Actualizar nombre si se proporciona
    if (full_name && full_name.trim() !== "") {
      user.full_name = full_name.trim()
    }

    // Actualizar foto de perfil si se sube una nueva
    if (req.file) {
      // Eliminar foto anterior si existe
      if (user.profile_picture) {
        const oldPath = path.join(__dirname, '..', user.profile_picture)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      
      // Guardar ruta relativa de la nueva foto
      user.profile_picture = `/uploads/profiles/${req.file.filename}`
    }

    // Cambiar contraseña si se proporciona
    if (current_password && new_password) {
      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(current_password, user.hash)
      
      if (!isValidPassword) {
        return res.status(403).json({
          error: true,
          msg: "La contraseña actual es incorrecta"
        })
      }

      // Validar nueva contraseña
      if (new_password.length < 6) {
        return res.status(400).json({
          error: true,
          msg: "La nueva contraseña debe tener al menos 6 caracteres"
        })
      }

      // Hash de la nueva contraseña
      const salt = await bcrypt.genSalt(10)
      user.hash = await bcrypt.hash(new_password, salt)
    }

    await user.save()

    res.json({
      error: false,
      msg: "Perfil actualizado correctamente",
      user: {
        full_name: user.full_name,
        email: user.email,
        profile_picture: user.profile_picture
      }
    })

  } catch (err) {
    console.error("Error al actualizar perfil:", err)
    res.status(500).json({
      error: true,
      msg: err.message || "Error interno del servidor"
    })
  }
})