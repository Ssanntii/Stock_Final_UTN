import { Navigate } from 'react-router'

import { useStore } from '../store/useStore'

const ProtectedRoute = ({ children }) => {
  const { user } = useStore()
  const isAuthenticated = user.token !== null && user.email !== null

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/auth" replace />
  }

  return children
}

export default ProtectedRoute