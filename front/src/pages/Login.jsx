import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { Form } from '../components/Form'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

import { loginUser } from '../api/apiConfig'
import { useStore } from '../store/useStore'

const Legend = () => {
  return <p>No tiene cuenta? <Link to="/auth/register" className="underline text-sky-800">Registrate</Link></p>
}

const Login = () => {
  const { setUser } = useStore()
  const navigate = useNavigate()

  // Estados
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Funciones
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const body = {
        email,
        password
      }
      const data = await loginUser(body)
      
      setUser({
        full_name: data.fullname,
        email: data.email,
        token: data.token
      })
      
      navigate("/")
    } catch (error) {
      console.log("Error:", error)
      setError(error.message || "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-sky-300 to-fuchsia-400">
      <Form title="Iniciar Sesion" Legend={Legend} onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <Input
          type="email"
          id="email"
          name="email"
          title="Email"
          placeholder="patito@patito.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
          disabled={loading}
        />
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Patito123"
          title="Contrasena"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
          disabled={loading}
        />
        <Button type='submit' disabled={loading} loading={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>
      </Form>
    </div>
  )
}

export default Login