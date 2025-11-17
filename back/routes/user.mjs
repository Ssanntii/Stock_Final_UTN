import { Router } from "express"
import { User } from '../models/User.mjs'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { validateUserRegister, validateUserLogin } from '../middleware/validation.mjs'
import { authenticateToken } from '../middleware/auth.mjs'
import multer from "multer";

const upload = multer();

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
        email: req.user.email
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
userRoutes.put("/update", authenticateToken, upload.none(), async (req, res) => {
  try {
    const { full_name } = req.body;

    if (!full_name || full_name.trim() === "") {
      return res.status(400).json({
        error: true,
        msg: "El nombre no puede estar vacío"
      });
    }

    // req.user lo establece authenticateToken
    const user = await User.findOne({ where: { email: req.user.email } });

    if (!user) {
      return res.status(404).json({
        error: true,
        msg: "Usuario no encontrado"
      });
    }

    user.full_name = full_name.trim();
    await user.save();

    res.json({
      error: false,
      msg: "Perfil actualizado correctamente",
      user: {
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    res.status(500).json({
      error: true,
      msg: "Error interno del servidor"
    });
  }
});
