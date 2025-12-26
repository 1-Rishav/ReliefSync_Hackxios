import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
const Auth = () => {

  const { token, role, verified, ngo_verified, agent_verified,NgoExist,AgentExist } = useSelector((state) => state.auth);
  if (token) {
    if (role === 'admin' && verified) {
      return <Navigate to='/admin' />
    } else if (role === 'ngo' && verified && ngo_verified) {
      return <Navigate to='/ngo' />
    } else if (role === 'gov_Agent' && verified && agent_verified) {
      return <Navigate to='/gov_agency' />
    } else if (role === 'citizen' && verified) {
      return <Navigate to='/' />
    }
  }

  return (
    <>

      
<Outlet />


    </>

  )
}

export default Auth