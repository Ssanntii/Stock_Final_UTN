import { Navigate } from 'react-router'
import { useStore } from '../store/useStore'
import { useEffect, useState } from 'react'
import { verifyToken } from '../api/apiConfig'

const ProtectedRoute = ({ children }) => {
  const { user, logout } = useStore()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      // Si no hay token o email, no está autenticado
      if (!user.token || !user.email) {
        setIsVerifying(false)
        setIsValid(false)
        return
      }

      try {
        // Verificar el token con el backend
        const response = await verifyToken()
        
        // Si la respuesta es exitosa y no hay error
        if (response && !response.error) {
          setIsValid(true)
        } else {
          // Token inválido, hacer logout
          logout()
          setIsValid(false)
        }
      } catch (error) {
        console.error('Error al verificar token:', error)
        // En caso de error, cerrar sesión por seguridad
        logout()
        setIsValid(false)
      } finally {
        setIsVerifying(false)
      }
    }

    validateToken()
  }, [user.token, user.email, logout])

  // Mostrar un loading mientras verifica
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no es válido, redirigir al login
  if (!isValid) {
    return <Navigate to="/auth" replace />
  }

  // Si es válido, mostrar el contenido protegido
  return children
}

export default ProtectedRoute