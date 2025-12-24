import React, { useState } from 'react'
import { easeInOut, motion, spring} from "motion/react"
import { Button, Input } from "@heroui/react";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../store/slices/authSlice';
import BackLogo from '../assets/Auth_back.png'
import logo from '../assets/Logo.png'
const ForgotPassword = () => {
  const [enteredValues, setEnteredValues] = useState({
      email: "",
     
    });
    const dispatch = useDispatch();
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEnteredValues((prev) => ({ ...prev, [name]: value }));
    };
      const isFormComplete = Object.values(enteredValues).every(val => val.trim() !== "");
  
    const handleSubmit = async()=>{
      const data = {
        ...enteredValues
      }
      try {
       await dispatch(forgotPassword(data))
      } catch (error) {
        console.log('hel',error);
      }
      setEnteredValues('')
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
      opacity:0,
      
      filter:"blur(5px)"
    }}
    animate={{
      opacity:1,
      
      filter:"blur(0px)"
    }}
    transition={{
      duration:0.4,
      type:spring,
      stiffness:100,
      damping:20,
      mass:2,
      ease:easeInOut
    }}
    className=" flex flex-col items-center justify-center w-full h-full p-2">
      <div className=' max-sm:text-3xl  md:text-4xl text 3xl:text-6xl font-semibold'>Forgot your password?</div>
      <div className=' text-lg 3xl:text-xl font-sans  flex  w-2/4  items-center justify-start mt-3'>Please enter the email address associated with your account and We will email you a link to reset your password.</div>
      <div className='flex max-sm:w-[90%] sm:w-[60%] items-center justify-center flex-col gap-2'>
      <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Email" type="email" isRequired name="email" value={enteredValues.email} onChange={handleChange} />
        <Button isDisabled={!isFormComplete} size='md' variant='shadow' color='success' radius='sm' fullWidth className='mt-2' onClick={handleSubmit}>Send Request</Button>
         <div className=' text-md font-sans w-full flex items-center justify-end hover:underline cursor-pointer hover:text-green-400'> <span><Link to={'/auth'} > Return to Sign in</Link></span> </div>
      </div>
      </motion.div>
        </div>
      </div>
    
    </>
  )
}

export default ForgotPassword