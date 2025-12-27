import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'
import { NavbarDemo } from '../components/Common_Features/Navbar';
import Sidebar from '../components/Common_Features/Sidebar';
const Gov_Agency = () => {

  const { token, role, verified, ngo_verified,NgoExist } = useSelector((state) => state.auth);

  const [isOpen , setIsOpen] = useState(false);
      const toggleSidebar = () => setIsOpen(!isOpen);
    
        useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = "hidden"; // Disable background scroll
        } else {
          document.body.style.overflow = "auto";
        }
      }, [isOpen]);

  if (token) {
    if (role === 'admin' && verified) {
      return <Navigate to='/admin' />
    } else if (role === 'ngo' && verified && ngo_verified) {
      return <Navigate to='/ngo' />
    }else if (role === 'ngo' && verified && !ngo_verified && NgoExist) {
      return <Navigate to='/auth/ngo_waitlist' />
    }else if (role === 'citizen' && verified) {
      return <Navigate to='/' />
    }
  }

  if (!token) {
    return <Navigate to='/auth' />
  }

  return (
    <>
    {isOpen && (
  <div
    className="fixed inset-0 z-40 backdrop-blur-sm bg-black/10"
    onClick={toggleSidebar}
  >  </div>
)}
    <NavbarDemo toggleSidebar={toggleSidebar}/>
    <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Outlet />
    </>
  )
}

export default Gov_Agency