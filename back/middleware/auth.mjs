import jwt from 'jsonwebtoken'
import { User } from '../models/User.mjs'

/**
 * Middleware para autenticar requests con JWT
 * Verifica el token y añade el usuario al request
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Obtener el header de autorización
    const auth = req.headers.authorization
    
    if (!auth) {
      return res.status(401).json({ 
        error: "No autorizado",
        msg: "Token no proporcionado" 
      })
    }

    // Extraer el token (formato: "Bearer TOKEN")
    const token = auth.split(" ")[1]
    
    if (!token) {
      return res.status(401).json({ 
        error: "No autorizado",
        msg: "Formato de token inválido" 
      })
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.SECRET)
    
    // Buscar el usuario en la base de datos
    const user = await User.findOne({ 
      where: { email: decoded.email },
      attributes: ['id', 'full_name', 'email', 'verified']
    })
    
    if (!user) {
      return res.status(404).json({ 
        error: "Usuario no encontrado",
        msg: "El usuario asociado al token no existe"
      })
    }

    // Agregar el usuario al request para uso en las rutas
    req.user = user
    
    // Continuar con la siguiente función
    next()
    
  } catch (error) {
    // Manejar diferentes tipos de errores de JWT
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
    
    // Error genérico
    return res.status(500).json({ 
      error: "Error de autenticación",
      msg: error.message 
    })
  }
}