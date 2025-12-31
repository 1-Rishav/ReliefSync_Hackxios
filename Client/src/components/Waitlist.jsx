import React, { useState } from "react";
import { Button } from "@heroui/react";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaCompass,
  FaTachometerAlt,
  FaSignInAlt,
} from "react-icons/fa";
import { motion } from 'motion/react'
import logo from "../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUnverifiedNGOsCount, fetchUnverifiedAgentsCount, getUser } from "../store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const MenuItem = ({ icon, label, sidebarOpen, active, extra, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer ${active ? "bg-gray-200 font-medium" : ""
      }`}
  >
    <div className="flex items-center gap-2">
      <div className="text-lg">{icon}</div>
      {sidebarOpen && <span>{label}</span>}
    </div>
    {sidebarOpen && extra && (
      <span className="text-xs text-gray-500">{extra}</span>
    )}
  </div>
);

export default function Waitlist() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unverifiedCount, setUnverifiedCount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getUser())
  },[dispatch])
  const { firstName, lastName, profile, role } = useSelector((state) => state.user)

  useEffect(() => {
    if (!role) return;
    const fetchuser = async () => {
      if (role === 'ngo') {
        const count = await dispatch(fetchUnverifiedNGOsCount())
        console.log(count)
        setUnverifiedCount(count)
      } else {
        const count = await dispatch(fetchUnverifiedAgentsCount())
        setUnverifiedCount(count)
      }
    }
    fetchuser();
  }, [role, dispatch]);
  const handleProfile = async () => {
    navigate('/auth/profile');
  }

  const name = `${firstName} ${lastName}`;
  return (
    <div className="flex h-screen mx-auto max-w-11xl bg-teal-50 ">
      {/* ======= Mobile Sidebar (overlay) ======= */}
      <div
        className={`fixed inset-0 z-40 bg-white bg-opacity-80 md:hidden transition-opacity duration-300 ${mobileOpen ? "block" : "hidden"
          }`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed z-50 inset-y-0 left-0 bg-white w-64 border-r shadow-lg transform transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" width={40} height={40} />
            <span className="font-bold text-lg">ReliefSync</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-2xl">
            <FaTimes />
          </button>
        </div>
        <SidebarContent sidebarOpen={true} />
      </aside>

      {/* ======= Desktop/Tablet Sidebar ======= */}
      <motion.aside
        className={`hidden md:flex flex-col transition-all duration-300 border-r shadow-sm bg-white ${sidebarOpen ? "w-64" : "w-16"
          }`}
        whileHover={{
          boxShadow: "0px 10px 10px rgba(150,80,150,0.7)",

        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-xl font-bold">
            {sidebarOpen && (
              <span className="flex items-center gap-2">
                <img src={logo} alt="logo" width={40} height={40} />
                ReliefSync
              </span>
            )}
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600"
          >
            {sidebarOpen ? (
              <FaTimes size={40} className="border-transparent hover:bg-gray-200 rounded-full p-2" />
            ) : (
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isHovered ? (
                  <FaBars size={40} className="border-transparent hover:bg-gray-200 rounded-full p-2" />
                ) : (
                  <img src={logo} alt="logo" width={40} height={40} />
                )}
              </div>
            )}
          </button>
        </div>
        <SidebarContent sidebarOpen={sidebarOpen} />
      </motion.aside>

      {/* ======= Main Content ======= */}
      <div className="flex-1 overflow-auto md:overflow-hidden min-h-screen h-full w-full ">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b">
          <div className="flex items-center gap-2">

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-2xl"
            >
              <FaBars />
            </button>
          </div>
          <div>
            <img
              src={logo}
              alt="User"
              className="rounded-full w-10 h-10"
            />
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 flex items-center justify-center max-md:flex-wrap gap-8  h-full">
          {/* Discovery Card */}
          <motion.section className="bg-white p-4 rounded-lg max-md:order-2 shadow-md md:flex-1 w-[50%] max-md:w-full"
            initial={{
              boxShadow: "0px 0px 10px 2px rgba(8,112,184,0.5)",

            }}
            whileTap={{
              y: 0
            }}
            whileHover={{
              boxShadow: "0px 10px 40px rgba(8,112,184,0.7)",
              y: -5
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="flex  flex-col items-center text-center gap-4">
              <motion.img
                src={profile}
                className="max-sm:w-40 max-sm:h-40 sm:w-50 sm:h-50 2xl:w-60 2xl:h-60 rounded-full mb-2 border-4 border-transparent"
                alt="Profile"
                initial={{
                  boxShadow: "0px 0px 10px 2px rgba(8,112,184,0.5)",

                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              />
              <div className="font-semibold max-sm:text-lg sm:text-xl lg:text-2xl font-serif">{name}</div>
            </div>
            <ul className="mt-8 flex flex-col  items-center justify-center space-y-4 max-sm:text-lg sm:text-xl lg:text-2xl  font-medium font-serif text-center">
              <Button color="success" radius='sm' variant='ghost' size='md' className=' font-bold text-lg font-serif flex items-center justify-center ' onClick={handleProfile}>Edit Profile</Button>

            </ul>
          </motion.section>

          {/* Waitlist Card */}
          <motion.section className="bg-white p-6 max-md:order-1 rounded-lg shadow-md md:flex-1 w-[50%] max-md:w-full"
            initial={{
              boxShadow: "0px 0px 10px 2px rgba(8,112,184,0.5)",

            }}
            whileTap={{
              y: 0
            }}
            whileHover={{
              boxShadow: "0px 10px 40px rgba(8,112,184,0.7)",
              y: -5
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="text-center font-serif mb-4">
              <h2 className="font-semibold  max-sm:text-lg sm:text-xl lg:text-4xl mb-8">You are on the waitlist:</h2>
              <motion.div className="border-transparent p-3 rounded-lg bg-gray-100 w-fit mx-auto"
                initial={{
                  boxShadow: "0px 0px 10px 2px rgba(8,112,184,0.5)",

                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <div className="text-3xl font-bold my-2">{role==="gov_Agent"?unverifiedCount.unverifiedAgents:unverifiedCount.unverifiedNGOs}</div>
                <p className="text-sm text-gray-500 mt-1">YOUR PLACE ON THE WAITLIST</p>
              </motion.div>

            </div>
            <p className="text-center font-serif max-sm:text-md sm:text-lg lg:text-xl my-3 text-gray-600">
              Thank you for your patience while we work with early members to refine our community experience.
            </p>
            <p className="text-center font-black font-serif max-sm:text-lg sm:text-xl lg:text-2xl my-4 text-black">
              We’ll email you when your application is reviewed!
            </p>
          </motion.section>
        </main>
      </div>
    </div>
  );
}

// Sidebar content wrapped separately for reuse
const SidebarContent = ({ sidebarOpen }) => {
  const [activeItem, setActiveItem] = useState("Community"); // default active item

  const navigate = useNavigate();

  const handleClick = async () => {
    navigate('/auth/profile');
    setActiveItem("Profile")
  }
  const handleDashboard = async () => {
    navigate('/auth/dashboard')
    setActiveItem("Dashboard")
  }
  const handleLogin = async () => {
    navigate('/auth')
    setActiveItem("Login")
  }
  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 space-y-3 p-4">
        <MenuItem
          icon={<FaCompass />}
          label="Community"
          sidebarOpen={sidebarOpen}
          active={activeItem === "Community"}
          onClick={() => setActiveItem("Community")}
        />
        <MenuItem
          icon={<FaTachometerAlt />}
          label="Dashboard"
          sidebarOpen={sidebarOpen}
          active={activeItem === "Dashboard"}
          onClick={handleDashboard}
        />
        <MenuItem
          icon={<FaSignInAlt />}
          label="Login"
          sidebarOpen={sidebarOpen}
          active={activeItem === "Login"}
          onClick={handleLogin}
        />
        <div className="border-t pt-2 mt-2 text-gray-500 text-sm">
          {sidebarOpen && "IDENTITY"}
        </div>
        <MenuItem
          icon={<FaUser />}
          label="Profile"
          sidebarOpen={sidebarOpen}
          active={activeItem === "Profile"}
          onClick={handleClick}
        />
      </nav>
    </div>
  );
};
