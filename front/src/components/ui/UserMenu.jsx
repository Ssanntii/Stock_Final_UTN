import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { useStore } from '../../store/useStore'
import { User, FileText, LogOut } from 'lucide-react'

const UserMenu = () => {
  const { user, logout, isAdmin } = useStore()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/')
  }

  const getProfilePhotoUrl = () => {
    if (user.profile_picture) {
      return `${import.meta.env.VITE_URL}${user.profile_picture}`
    }
    return null
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar clickeable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600 hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {getProfilePhotoUrl() ? (
          <img
            src={getProfilePhotoUrl()}
            alt={user.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
          </div>
        )}
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
          {/* Header del menú con info del usuario */}
          <div className="p-4 bg-slate-700/50 border-b border-slate-600">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-600 shrink-0">
                {getProfilePhotoUrl() ? (
                  <img
                    src={getProfilePhotoUrl()}
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>

              {/* Info del usuario */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm truncate">
                    {user.full_name}
                  </p>
                  {/* ✅ Badge de admin SOLO aquí */}
                  {isAdmin() && (
                    <span className="px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full shrink-0">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Opciones del menú */}
          <div className="py-2">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Mi Perfil</span>
            </Link>

            {/* ✅ Ver Historial SOLO para admin */}
            {isAdmin() && (
              <Link
                to="/logs"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Ver Historial</span>
              </Link>
            )}

            <div className="border-t border-slate-700 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu