import React, { useState } from 'react'
import { Button, Input, Select, SelectSection, SelectItem } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from './EyeIcon';
import { easeInOut, motion, spring } from "motion/react"
import { Link } from 'react-router-dom';
import { register } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux'
import GoogleAuth from './GoogleAuth'
import BackLogo from '../assets/Auth_back.png'
import logo from '../assets/Logo.png'

export const roleType = [
  { key: "citizen", label: "Citizen" },
  { key: "ngo", label: "NGO" },
  { key: "gov_Agent", label: "Gov_Agent" },
]
const Signup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [enteredValues, setEnteredValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnteredValues((prev) => ({ ...prev, [name]: value }));
  };
  let isFormComplete = true;
  const Uppercase = /[A-Z]/;
  const Special = /[!@#$%^&*(),.?":{}|<>_-]/;


  Object.entries(enteredValues).forEach(([key, value]) => {
    const trimmed = value?.trim?.() ?? "";

    const alwaysRequired = ["firstName", "lastName", "email", "password", "role"];
    if (alwaysRequired.includes(key) && trimmed === "") {
      isFormComplete = false;
    }
    if (key === "password") {
      const lengthValid = trimmed.length >= 9;
      const uppercaseValid = Uppercase.test(trimmed);
      const specialValid = Special.test(trimmed);
      isFormComplete = isFormComplete && lengthValid && uppercaseValid && specialValid;
    }
    if (enteredValues.role === "citizen" && key === "phone") {
      if (trimmed?.length !== 10) {
        isFormComplete = false;
      }
    } else {
      if (key === "phone" && enteredValues.role !== "citizen") {
        if(trimmed.length >0){
        setEnteredValues((prev) => ({ ...prev, phone: "" }));
        isFormComplete = false;
        }
      }
    }
  })

  const password = enteredValues.password?.trim() || "";

  const isLengthValid = password.length >= 9;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_-]/.test(password);

  const handleSubmit = async () => {
    setLoading(true)
    const data = {
      ...enteredValues
    }
    try {
      await dispatch(register(data))
    } catch (error) {
      console.log('hel', error);
    }
    setEnteredValues({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      phone: "",
    })
    setLoading(false);
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
            className="flex flex-col items-center justify-center w-full h-full p-2">
            <div className='max-sm:text-3xl  md:text-4xl text 3xl:text-6xl font-semibold'>Get started with ReliefSync</div>
            <div className=' text-md 3xl:text-xl font-sans  flex  items-center justify-start mt-3'>Already have an account ?<motion.span className='hover:underline cursor-pointer text-green-500 text-lg md:text-xl' whileTap={{scale:1.2}}> <Link to={'/auth'}>SIGN IN</Link> </motion.span> </div>
            <div className='flex max-sm:w-[90%] sm:w-[60%] items-center justify-center flex-col gap-2'>
              <div className='flex flex-col items-start w-full justify-between'>
                <div className='flex w-full items-center justify-between gap-8'>
                  <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="First Name" type="text" name="firstName" isRequired value={enteredValues.firstName} onChange={handleChange} />
                  <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Last Name" type="text" name="lastName" value={enteredValues.lastName} onChange={handleChange} />
                </div>
                <div className='w-full flex items-center justify-start mt-4'>

                  <Select className=' flex items-center justify-center w-[45%]' name='role' label="Select" isRequired variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' value={enteredValues.role} onChange={handleChange} selectedKeys={enteredValues.role ? [enteredValues.role] : []}>
                    {roleType.map((role) => (
                      <SelectItem key={role.key}>{role.label}</SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              {enteredValues.role === 'citizen' && <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Phone" type="number" isRequired name="phone" value={enteredValues.phone} onChange={handleChange} isInvalid={enteredValues.phone?.trim().length > 0 && enteredValues.phone?.trim().length !== 10}
                errorMessage={
                  enteredValues.phone?.trim().length > 0 && enteredValues.phone?.trim().length !== 10
                    ? "Phone number must be 10 digits"
                    : ""
                } />}
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
                name="password" value={enteredValues.password} onChange={handleChange}
                isRequired
                isInvalid={
                  password.length > 0 &&
                  (!isLengthValid || !hasUppercase || !hasSpecial)
                }

                errorMessage={
                  password.length > 0 &&
                    (!isLengthValid || !hasUppercase || !hasSpecial) ? (
                    <ul className="list-disc ml-4">
                      {!isLengthValid && <li>Password must be at least 9 characters long</li>}
                      {!hasUppercase && <li>Password must contain at least 1 uppercase letter</li>}
                      {!hasSpecial && <li>Password must contain at least 1 special character</li>}
                    </ul>
                  ) : null
                }
              />
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
                } isDisabled={!isFormComplete} size='md' variant='shadow' color='success' radius='sm' fullWidth className='mt-2' onClick={handleSubmit}>SIGN UP</Button>
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

export default Signup