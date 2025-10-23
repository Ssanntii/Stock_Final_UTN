import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'

const Public = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Outlet />
    </div>
  )
}


export default Public