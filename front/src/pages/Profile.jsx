import { useState } from "react"
import { Link } from "react-router"
import { useStore } from "../store/useStore"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { updateUserProfile } from "../api/apiConfig"
import { User, Camera, Lock, ArrowLeft } from "lucide-react"
import logo from '/stock.png'

const Profile = () => {
  const { user, setUser } = useStore()
  const API_URL = import.meta.env.VITE_URL

  // Estados del formulario
  const [fullName, setFullName] = useState(user.full_name)
  const [profilePicture, setProfilePicture] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(
    user.profile_picture ? `${API_URL}${user.profile_picture}` : null
  )
  
  // Estados para cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  // Estados de UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no puede superar los 5MB")
        return
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError("Solo se permiten archivos de imagen")
        return
      }

      setProfilePicture(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  // Validar formulario
  const validateForm = () => {
    if (!fullName.trim()) {
      return "El nombre es obligatorio"
    }

    if (showPasswordSection) {
      if (!currentPassword) {
        return "Ingresá tu contraseña actual"
      }
      if (!newPassword) {
        return "Ingresá la nueva contraseña"
      }
      if (newPassword.length < 6) {
        return "La nueva contraseña debe tener al menos 6 caracteres"
      }
      if (newPassword !== confirmPassword) {
        return "Las contraseñas no coinciden"
      }
    }

    return null
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append("full_name", fullName.trim())
      
      if (profilePicture) {
        formData.append("profile_picture", profilePicture)
      }

      if (showPasswordSection) {
        formData.append("current_password", currentPassword)
        formData.append("new_password", newPassword)
      }

      const updated = await updateUserProfile(formData)

      // Actualizar estado global
      setUser({
        ...user,
        full_name: updated.user.full_name,
        profile_picture: updated.user.profile_picture
      })

      // Actualizar preview con la nueva imagen
      if (updated.user.profile_picture) {
        setPreviewUrl(`${API_URL}${updated.user.profile_picture}`)
      }

      setSuccess("¡Perfil actualizado correctamente! 🎉")
      
      // Limpiar campos de contraseña
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordSection(false)
      setProfilePicture(null)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt='logo' className="w-12 h-12" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Mi Perfil</h1>
                <p className="text-sm text-slate-300">Administrá tu información personal</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="secondary" size="md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mensajes */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900/50 border border-green-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Foto de perfil */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-700 border-4 border-slate-600">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-slate-500" />
                    </div>
                  )}
                </div>
                
                {/* Botón de cámara */}
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              <p className="text-sm text-slate-400 mt-3 text-center">
                Clic en el ícono para cambiar tu foto de perfil<br/>
                <span className="text-xs">Máximo 5MB - JPG, PNG, GIF, WEBP</span>
              </p>
            </div>

            {/* Información básica */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </h3>

              <Input
                label="Nombre completo"
                name="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre completo"
                required
                disabled={loading}
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="w-full px-4 py-3 border border-slate-600 bg-slate-700/50 text-slate-400 rounded-lg">
                  {user.email}
                </div>
                <p className="text-xs text-slate-500 mt-1">El email no se puede modificar</p>
              </div>
            </div>

            {/* Cambiar contraseña */}
            <div className="space-y-6 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Lock className="w-5 h-5" />
                <span className="font-semibold">
                  {showPasswordSection ? 'Ocultar' : 'Cambiar'} contraseña
                </span>
              </button>

              {showPasswordSection && (
                <div className="space-y-5 pl-7">
                  <Input
                    label="Contraseña actual"
                    name="current_password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />

                  <Input
                    label="Nueva contraseña"
                    name="new_password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />

                  <Input
                    label="Confirmar nueva contraseña"
                    name="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                loading={loading}
              >
                {loading ? 'Guardando cambios...' : 'Guardar Cambios'}
              </Button>

              <Link to="/" className="flex-1 sm:flex-none">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Profile