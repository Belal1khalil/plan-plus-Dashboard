import React from 'react'
import { Navigate } from 'react-router-dom'

export default function Protected ({children}) {
  return <>
  {
    sessionStorage.getItem("token") ? children: <Navigate to="/" />
  }
  
  
  </>
}
