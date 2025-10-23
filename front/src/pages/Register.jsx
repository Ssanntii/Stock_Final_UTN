import { useState } from 'react'
import { Form } from '../components/Form'
import Input from '../components/ui/Input'
import Button from "../components/ui/Button"
import { Link } from 'react-router'

const Legend = () => {
  return <p>Ya tiene cuenta? <Link to="/login" className='underline text-sky-800'>Inicia Sesion</Link></p>
}

const Register = () => {
  // Estados del componente
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Funciones 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = `${import.meta.env.VITE_URL}/users/register`
      const body = {
        fullName,
        email,
        password,
        confirmPassword
      }

      const req = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(body)
      })

      const res = await req.json()

      if (res.error) {
        return
      }

      setFullName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")

    } catch (error){
      console.log("Hubo un error al crear el usuario: ", error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-sky-300 to-fuchsia-400">
      <Form title="Crear cuenta" Legend={Legend} onSubmit={handleSubmit}>
        <Input
          name="Fullname"
          type="text"
          id="fullname"
          title="Nombre completo"
          placeholder="Joe Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          name="email"
          type="email"
          title="Correo"
          placeholder="correo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          name="Password"
          title="Contrasena"
          placeholder="Patito123"
          value={password}
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          title="Confirmar Contrasena"
          placeholder="Patito123"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type='submit' >
          {loading ? 'Cargando...' : 'Registrarse'}
        </Button>
      </Form>
    </div>
    )
}

export default Register