import React from 'react'
import {motion,easeInOut,spring} from 'motion/react'
import {Button} from "@heroui/react";
import { verify } from '../store/slices/authSlice';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import BackLogo from '../assets/Auth_back.png'
import logo from '../assets/Logo.png'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../components/ui/input-otp"
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

const FormSchema = z.object({
  
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})
const VerifyEmail = () => {
  const [loading , setLoading]=useState(false);
  const {email} = useSelector((state)=>state.auth);
   const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });
  const dispatch = useDispatch();
  const onSubmit = (data) => {
    setLoading(true);
    const payload = {
      ...data,
      email
    }
    try {
      dispatch(verify(payload))
    } catch (error) {
      console.log(error);
    }finally{
setLoading(false);
    }
  };

  return (
   <>
   <div className='relative overflow-hidden min-h-screen mx-auto max-w-11xl w-full h-full flex items-center justify-center bg-teal-50' >

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
        <div className=' w-full h-full flex max-lg:flex-col px-4 items-center justify-center bg-white rounded-xl'>
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
    className=" flex flex-col items-center justify-center gap-4 w-full h-full p-2">
      <div className=' max-sm:text-3xl  md:text-4xl text 3xl:text-6xl font-semibold'>Please Verify OTP</div>
            <div className=' text-sm 3xl:text-lg text-neutral-500 font-sans  flex  items-center justify-start mt-1'>Sent to email ({email}) </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center justify-center flex-col md:w-full space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              
              <FormControl>
                <InputOTP maxLength={6} {...field} className="max-w-[280px] sm:max-w-none mx-auto">
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator/>
                    <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
<div className='flex mx-auto items-center justify-center w-full sm:w-[60%] px-2'>
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
                } size='md' variant='shadow' color='success' radius='sm' fullWidth className='mt-2' type='submit'>VERIFY</Button>
          </div>
      </form>
    </Form>
          
      </motion.div>
        </div>
      </div>
   
   </>
  )
}

export default VerifyEmail