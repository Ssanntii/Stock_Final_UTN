import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { Form } from '../components/Form'
import Input from '../components/ui/Input'
import Button from "../components/ui/Button"

import { registerUser } from '../api/apiConfig'

const Legend = () => {
  return <p>Ya tiene cuenta? <Link to="/auth" className='underline text-sky-800'>Inicia Sesion</Link></p>
}

const Register = () => {
  const navigate = useNavigate()

  // Estados del componente
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Funciones 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const body = {
        fullName,
        email,
        password,
        confirmPassword
      }
      await registerUser(body)

      setFullName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setSuccess(true)

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/auth')
      }, 2000)

    } catch (error) {
      console.log("Hubo un error al crear el usuario: ", error)
      setError(error.message || "Error al registrar el usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-sky-300 to-fuchsia-400">
      <Form title="Registrarse" Legend={Legend} onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        )}

        <Input
          name="Fullname"
          type="text"
          id="fullname"
          title="Nombre completo"
          placeholder="Joe Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
        />
        <Input
          name="email"
          type="email"
          title="Correo"
          placeholder="correo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Input
          type="password"
          name="Password"
          title="Contrasena"
          placeholder="Patito123"
          value={password}
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          title="Confirmar Contrasena"
          placeholder="Patito123"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        <Button type='submit' disabled={loading} loading={loading}>
          {loading ? 'Cargando...' : 'Registrarse'}
        </Button>
      </Form>
    </div>
  )
}

export default Register