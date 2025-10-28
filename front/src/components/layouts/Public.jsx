import { Outlet, useNavigate } from 'react-router'
import { useEffect } from 'react'

import { verifyToken } from '../../api/apiConfig'
import { useStore } from '../../store/useStore'

const Public = () => {
  const { user, setUser } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    async function verifyUser() {
      // Si ya hay un token, verificarlo
      if (user.token) {
        try {
          const data = await verifyToken(user.token)

          // Si el token es válido, redirigir a home
          if (!data.error) {
            navigate("/")
          } else {
            // Si el token es inválido, limpiar el usuario
            setUser({
              full_name: null,
              email: null,
              token: null
            })
          }
        } catch (error) {
          console.log('Error verificando token:', error)
          // En caso de error, limpiar el usuario
          setUser({
            full_name: null,
            email: null,
            token: null
          })
        }
      }
    }
    
    verifyUser()
  }, [user.token, navigate, setUser])

  return (
    <div className="min-h-screen bg-slate-900">
      <Outlet />
    </div>
  )
}

export default Public