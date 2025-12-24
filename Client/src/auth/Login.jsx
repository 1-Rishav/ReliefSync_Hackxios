import React, { useState } from 'react'
import { Button, Input } from "@heroui/react";
import { Link } from 'react-router-dom'
import { EyeFilledIcon, EyeSlashFilledIcon } from './EyeIcon';
import { easeInOut, motion, spring } from "motion/react"
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import GoogleAuth from './GoogleAuth';
import BackLogo from '../assets/Auth_back.png'
import logo from '../assets/Logo.png'


const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
const [loading , setLoading]=useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [enteredValues, setEnteredValues] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnteredValues((prev) => ({ ...prev, [name]: value }));
  };
  const isFormComplete = Object.values(enteredValues).every(val => val.trim() !== "");

  const handleSubmit = async () => {
    setLoading(true)
    const data = {
      ...enteredValues
    }
    try {
      await dispatch(login(data))
    } catch (error) {
      console.log('hel', error);
    }
    setEnteredValues('')
    setLoading(false)
  }

  return (
    <>
    <div className='min-h-screen w-full mx-auto max-w-11xl h-full flex items-center justify-center bg-teal-50' >

        <motion.img
          animate={{ scale: [0.5, 0.9] }}
          transition={{
            
            duration: 5.5,
            ease: "easeInOut",
            type: "spring",
            stiffness: 20,
            damping: 7,
            mass: 10
          }}
          className='absolute max-sm:w-[100%] md:w-[80%] md:h-full xl:w-[60%] xl:h-[92%] opacity-8' src={BackLogo} alt="l" />
        <div className=' w-full h-full flex max-lg:flex-wrap items-center justify-center bg-white rounded-xl'>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.98,
              filter: "blur(5px)"
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)"
            }}
            transition={{
              duration: 0.4,

            }}
            className=' flex w-full items-center justify-center'>
            <img className='3xl:h-[600px] 3xl:w-[600px] xl:h-[500px] xl:w-[500px]  md:h-[300px] md:w-[300px] h-[200px] w-[200px]' src={logo} alt="logo" />
          </motion.div>
          <motion.div
        initial={{
          opacity: 0,

          filter: "blur(5px)"
        }}
        animate={{
          opacity: 1,

          filter: "blur(0px)"
        }}
        transition={{
          duration: 0.4,
          type: spring,
          stiffness: 100,
          damping: 20,
          mass: 2,
          ease: easeInOut
        }}
        className=" flex flex-col items-center justify-center w-full h-full p-2">
        <div className=' max-sm:text-3xl  md:text-4xl text 3xl:text-6xl font-semibold'>Login to ReliefSync</div>
        <div className=' text-md 3xl:text-xl font-sans  flex  items-center justify-start mt-3'>New user?<motion.span className='hover:underline cursor-pointer text-green-500 text-lg md:text-xl' whileTap={{scale:1.2}}><Link to={'signup'} >CREATE ACCOUNT</Link></motion.span> </div>
        <div className='flex max-sm:w-[90%] sm:w-[60%] items-center justify-center flex-col gap-2'>
          <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Email" type="email" isRequired name="email" value={enteredValues.email} onChange={handleChange} />
          <Input
            variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg'
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            label="Password"
            type={isVisible ? "text" : "password"}
            isRequired
            name="password" value={enteredValues.password} onChange={handleChange}
          />
          <div className='text-md font-sans w-full flex -px-50 items-center justify-end hover:underline cursor-pointer hover:text-green-400'> <Link to={'forgot-password'} >Forgot Password?</Link> </div>
          <Button
          isLoading={loading}
          spinner={
        <svg
          className="animate-spin h-5 w-5 text-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          />
        </svg>
      } isDisabled={!isFormComplete} size='md' variant='shadow' color='success' radius='sm' fullWidth onClick={handleSubmit}>LOGIN</Button>
        </div>
        <div className='flex items-center justify-between mt-4 gap-2 max-sm:w-full'>
          <div className='h-[0.2px] bg-gray-400 w-full sm:w-30'></div>
          <div>OR</div>
          <div className='h-[0.2px] bg-gray-400 w-full sm:w-30'></div>

        </div>
        <div className='flex items-center justify-center text-md text-neutral-600 font-mono mt-1'>Only for Citizen</div>
        <div className='h-full w-full '>
          <div className='flex items-center justify-center pt-5 '>
            <GoogleAuth />
          </div>
        </div>
      </motion.div>
        </div>
      </div>
      
    </>
  )
}

export default Login