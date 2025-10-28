import { useState } from 'react'
import { Link } from 'react-router'

import { Form } from '../components/Form'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

import { loginUser } from '../api/apiConfig'
import { useStore } from '../store/useStore'

const Legend = () => {
  return <p>No tiene cuenta? <Link to="/auth/register" className="underline text-sky-800" >Registrate</Link></p>
}

const Login = () => {

  const { setUser } = useStore()

  // Estados
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Funciones
  const handleSubmit = async (e) => {
    e.preventDefault()
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
      console.log("Sesión iniciada!")
    } catch {
      console.log("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-sky-300 to-fuchsia-400">
      <Form title="Iniciar Sesion" Legend={Legend} onSubmit={handleSubmit}>
        <Input
          type="email"
          id="email"
          name="email"
          title="Email"
          placeholder="patito@patito.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
        />
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Patito123"
          title="Contrasena"
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
        />
        <Button type='submit'>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>
      </Form>
    </div>
  )
}

export default Login