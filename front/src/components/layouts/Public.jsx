import { Outlet, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'

const Public = () => {
  const { user, setUser } = useStore()
  const navigate = useNavigate()
  useEffect(() => {

    async function verifyUser() {
      const url = `${import.meta.env.VITE_API_URL}/users/verify-token`
      const config = {
        method: "GET",
        headers: {
          'content-type': "application/json",
          'authorization': user.token
        }
      }

      const req = await fetch(url, config)
      const res = await req.json()

      if (res.error) {
        setUser({
          full_name: null,
          token: null,
          email: null
        })
        return
      }

      navigate("/private")

    }
    verifyUser()

  }, [user])
  return (
    <div className="min-h-screen bg-slate-900">
      <Outlet />
    </div>
  )
}

export default Public