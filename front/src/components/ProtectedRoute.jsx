import { Navigate } from 'react-router'
import { useStore } from '../store/useStore'
import { useEffect, useState } from 'react'
import { verifyToken } from '../api/apiConfig'

const ProtectedRoute = ({ children }) => {
  const { user, logout } = useStore()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      // Si no hay token o email -> NO autenticado
      if (!user.token || !user.email) {
        setAuthorized(false)
        setChecking(false)
        return
      }

      try {
        // Verificar token en backend
        const resp = await verifyToken()

        if (resp && !resp.error) {
          setAuthorized(true)
        } else {
          logout()
          setAuthorized(false)
        }
      } catch (err) {
        console.error("Error al verificar token:", err)
        logout()
        setAuthorized(false)
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [user.token, user.email, logout])

  // Mostrar loader mientras valida
  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no está autorizado → al login
  if (!authorized) {
    return <Navigate to="/auth" replace />
  }

  // Si está permitido → renderiza la página
  return children
}

export default ProtectedRoute
