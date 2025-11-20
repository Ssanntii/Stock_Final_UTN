import { Router } from "express"
import { User } from '../models/User.mjs'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { validateUserRegister, validateUserLogin } from '../middleware/validation.mjs'
import { authenticateToken } from '../middleware/auth.mjs'
import { uploadProfilePicture } from '../config/multer.mjs'
import { sendVerificationEmail } from '../utils/emailService.mjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const userRoutes = Router()

// Función para generar código de verificación de 6 dígitos
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// ✅ Función para crear token JWT con expiración
const createToken = (email, expiresIn = '7d') => {
  return jwt.sign({ email }, process.env.SECRET, { expiresIn })
}

// Ruta REGISTER (con validaciones y verificación por email)
userRoutes.post("/register", validateUserRegister, async (req, res) => {
  try {
    const { full_name, email, password } = req.body
    let role = 'user'
    
    // El primer usuario es admin
    const allUsers = await User.findAll()
    if (allUsers.length === 0) {
      role = 'admin'
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } })
    if (existingUser) {
      return res.status(409).json({
        error: true,
        msg: "Ya existe un usuario registrado con ese email"
      })
    }

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // Generar código de verificación
    const verificationCode = generateVerificationCode()

    // Crear usuario (sin verificar)
    const user = new User({
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      hash,
      verification_code: verificationCode,
      verified: false,
      role
    })

    await user.save()

    // Enviar email con el código de verificación
    try {
      await sendVerificationEmail(user.email, user.full_name, verificationCode)
    } catch (emailError) {
      console.error('Error al enviar email:', emailError)
      // Opcional: eliminar el usuario si el email falla
      // await user.destroy()
      return res.status(500).json({
        error: true,
        msg: "Error al enviar el email de verificación. Por favor, intenta nuevamente."
      })
    }
    
    res.json({ 
      error: false, 
      msg: "Usuario creado exitosamente. Revisa tu email para verificar tu cuenta.",
      email: user.email // ✅ Enviar email para uso en frontend
    })

  } catch (err) {
    console.error('Error en registro:', err)
    res.status(400).json({
      error: true,
      msg: err.message
    })
  }
})

// ✅ Ruta para VERIFICAR EMAIL
userRoutes.post("/verify-email", async (req, res) => {
  try {
    const { email, verification_code } = req.body

    // Validar datos
    if (!email || !verification_code) {
      return res.status(400).json({
        error: true,
        msg: "Email y código de verificación son requeridos"
      })
    }

    // Buscar usuario
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim() 
      } 
    })

    if (!user) {
      return res.status(404).json({
        error: true,
        msg: "Usuario no encontrado"
      })
    }

    // Verificar si ya está verificado
    if (user.verified) {
      return res.status(400).json({
        error: true,
        msg: "Este usuario ya está verificado"
      })
    }

    // ✅ Verificar si el código expiró (15 minutos)
    if (user.verification_code_expires && new Date() > user.verification_code_expires) {
      return res.status(400).json({
        error: true,
        msg: "El código de verificación ha expirado. Solicita uno nuevo.",
        expired: true
      })
    }

    // Verificar código
    if (user.verification_code !== verification_code) {
      return res.status(400).json({
        error: true,
        msg: "Código de verificación incorrecto"
      })
    }

    // Marcar como verificado
    user.verified = true
    user.verification_code = null
    user.verification_code_expires = null
    await user.save()

    res.json({
      error: false,
      msg: "Email verificado exitosamente. Ahora puedes iniciar sesión."
    })

  } catch (err) {
    console.error('Error en verificación:', err)
    res.status(500).json({
      error: true,
      msg: "Error al verificar el código"
    })
  }
})

// ✅ Ruta para REENVIAR código de verificación
userRoutes.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        error: true,
        msg: "Email es requerido"
      })
    }

    // Buscar usuario
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim() 
      } 
    })

    if (!user) {
      return res.status(404).json({
        error: true,
        msg: "Usuario no encontrado"
      })
    }

    // Verificar si ya está verificado
    if (user.verified) {
      return res.status(400).json({
        error: true,
        msg: "Este usuario ya está verificado"
      })
    }

    // Generar nuevo código
    const newVerificationCode = generateVerificationCode()
    user.verification_code = newVerificationCode
    user.verification_code_expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
    await user.save()

    // Enviar email
    try {
      await sendVerificationEmail(user.email, user.full_name, newVerificationCode)
    } catch (emailError) {
      console.error('Error al enviar email:', emailError)
      return res.status(500).json({
        error: true,
        msg: "Error al enviar el email de verificación"
      })
    }

    res.json({
      error: false,
      msg: "Código de verificación reenviado exitosamente"
    })

  } catch (err) {
    console.error('Error al reenviar código:', err)
    res.status(500).json({
      error: true,
      msg: "Error al reenviar el código"
    })
  }
})

// ✅ Ruta LOGIN mejorada (con verificación y redirección)
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

    // ✅ VERIFICAR SI EL EMAIL ESTÁ VERIFICADO
    if (!user.verified) {
      // Reenviar código automáticamente
      const newCode = generateVerificationCode()
      user.verification_code = newCode
      user.verification_code_expires = new Date(Date.now() + 15 * 60 * 1000)
      await user.save()

      try {
        await sendVerificationEmail(user.email, user.full_name, newCode)
      } catch (emailError) {
        console.error('Error al enviar email:', emailError)
      }

      return res.status(403).json({
        error: true,
        msg: "Tu cuenta no está verificada. Te hemos enviado un nuevo código de verificación a tu email.",
        needsVerification: true,
        email: user.email
      })
    }

    // Crear token con expiración
    const token = createToken(user.email, '7d')

    res.json({
      error: false,
      user: {
        full_name: user.full_name,
        email: user.email,
        profile_picture: user.profile_picture,
        role: user.role,
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
        profile_picture: req.user.profile_picture,
        role: req.user.role
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
    const { full_name, current_password, new_password, remove_photo } = req.body

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

    // Manejar eliminación de foto
    if (remove_photo === "true") {
      // Eliminar archivo físico si existe
      if (user.profile_picture) {
        const oldPath = path.join(__dirname, '..', user.profile_picture)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      // Establecer en null en la base de datos
      user.profile_picture = null
    }
    // Actualizar foto de perfil si se sube una nueva
    else if (req.file) {
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