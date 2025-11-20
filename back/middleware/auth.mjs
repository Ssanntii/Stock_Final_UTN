import jwt from 'jsonwebtoken'
import { User } from '../models/User.mjs'

/**
 * Middleware para autenticar requests con JWT
 * Verifica el token y añade el usuario al request
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    
    if (!auth) {
      return res.status(401).json({ 
        error: "No autorizado",
        msg: "Token no proporcionado" 
      })
    }

    const token = auth.split(" ")[1]
    
    if (!token) {
      return res.status(401).json({ 
        error: "No autorizado",
        msg: "Formato de token inválido" 
      })
    }

    // ✅ Verificar token con manejo de expiración
    const decoded = jwt.verify(token, process.env.SECRET)
    
    // Buscar usuario incluyendo el rol
    const user = await User.findOne({ 
      where: { email: decoded.email },
      attributes: ['id', 'full_name', 'email', 'verified', 'role', 'profile_picture']
    })
    
    if (!user) {
      return res.status(404).json({ 
        error: "Usuario no encontrado",
        msg: "El usuario asociado al token no existe"
      })
    }

    req.user = user
    next()
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Token inválido",
        msg: "El token proporcionado no es válido"
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Token expirado",
        msg: "El token ha expirado, por favor inicia sesión nuevamente"
      })
    }
    
    return res.status(500).json({ 
      error: "Error de autenticación",
      msg: error.message 
    })
  }
}

/**
 * ✅ Middleware para verificar que el usuario sea ADMIN (sin duplicación)
 */
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: "Acceso denegado",
      msg: "Solo los administradores pueden realizar esta acción"
    })
  }
  next()
}