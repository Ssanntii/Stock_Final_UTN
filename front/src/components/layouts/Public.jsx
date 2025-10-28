import { Outlet, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'

import { verifyToken } from '../../api/apiConfig'
import { useStore } from '../../store/useStore'

const Public = () => {
  const { user, setUser } = useStore()
  const navigate = useNavigate()
  useEffect(() => {

    async function verifyUser() {
      try{
        const data = await verifyToken()

        if (data.error) {
          setUser({
            full_name: null,
            email: null,
            token: null
          })
        }

        navigate("/")
      } catch(error) {
        console.log(error)
      }
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