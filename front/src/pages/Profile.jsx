import { useState } from "react"
import { useStore } from "../store/useStore"
import Button from "../components/ui/Button"
import { updateUserProfile } from "../api/apiConfig"

const Profile = () => {
  const { user, setUser } = useStore()
  const [fullName, setFullName] = useState(user.full_name)
  const [email, setEmail] = useState(user.email)
  const [coverPreview, setCoverPreview] = useState(user.cover || null)
  const [coverFile, setCoverFile] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append("full_name", fullName)
      formData.append("email", email)
      if (coverFile) formData.append("cover", coverFile)

      const updated = await updateUserProfile(formData)

      setUser({
        ...user,
        full_name: updated.full_name,
        email: updated.email,
        cover: updated.cover
      })

      setSuccess("Perfil actualizado correctamente 🎉")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">

        <h1 className="text-3xl font-bold text-white mb-6">Mi Perfil</h1>

        {/* Portada */}
        <div className="mb-6">
          <p className="text-slate-300 mb-2">Imagen de Portada</p>

          <div className="relative w-full h-52 bg-slate-700 rounded-xl overflow-hidden mb-3">
            {coverPreview ? (
              <img
                src={coverPreview}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                No hay portada
              </div>
            )}
          </div>

          {/* Botón para seleccionar archivo */}
          <label
            className="cursor-pointer inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Seleccionar imagen
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nombre */}
          <div>
            <label className="block text-slate-300 mb-1">Nombre completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
            />
          </div>

          {/* Mensajes */}
          {error && (
            <p className="text-red-400 bg-red-900/40 border border-red-700 rounded-lg p-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-400 bg-green-900/40 border border-green-700 rounded-lg p-2">
              {success}
            </p>
          )}

          {/* Botón guardar */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Profile
