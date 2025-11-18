import { Navigate } from 'react-router'
import { useStore } from '../store/useStore'
import { useEffect, useState } from 'react'
import { verifyToken } from '../api/apiConfig'

const AdminRoute = ({ children }) => {
  const { user, logout, isAdmin } = useStore()
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (!user.token || !user.email) {
        setAuthorized(false)
        setChecking(false)
        return
      }

      try {
        const resp = await verifyToken()

        if (resp && !resp.error) {
          // Verificar que sea admin
          if (isAdmin()) {
            setAuthorized(true)
          } else {
            setAuthorized(false)
          }
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
  }, [user.token, user.email, user.role, logout, isAdmin])

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando permisos de administrador...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-8 max-w-md text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Acceso Denegado</h2>
          <p className="text-white mb-6">No tienes permisos de administrador para acceder a esta página.</p>
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }

  return children
}

export default AdminRoute