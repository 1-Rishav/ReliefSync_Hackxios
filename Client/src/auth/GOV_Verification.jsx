import React, { useState } from 'react'
import { motion, spring, easeInOut } from 'motion/react';
import { Button, Input } from '@heroui/react';
import BackLogo from '../assets/Auth_back.png'
import logo from '../assets/Logo.png'
import { useDispatch } from 'react-redux'
import { agentEntry } from '../store/slices/authSlice';
const GOV_Verification = () => {

  const [enteredData, setEnteredData] = useState({
    official_id: "",
    department: "",
    badge_number: "",
    current_state: "",
    office_location: "",
  })
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "official_id") {
      setEnteredData(prev => ({ ...prev, [name]: files[0] })); // Store the first selected file
    } else {
      setEnteredData(prev => ({ ...prev, [name]: value }));
    }
  }
  const isFormComplete = Object.entries(enteredData).every(([key, val]) => {
    if (key === "official_id") {
      return val instanceof File;
    }
    return typeof val === 'string' && val.trim() != "";
  })

  const handleSubmit = async () => {
    const formData = new FormData();

    // Append entered values (text fields)
    Object.entries(enteredData).forEach(([key, value]) => {
      if (key !== "official_id")
        formData.append(key, value);
    });

    // Append file separately
    if (enteredData.official_id instanceof File) {
      formData.append('official_id', enteredData.official_id); // Ensure file is a valid File object
    }
    //setEnteredData("");
    try {
      await dispatch(agentEntry(formData))
    } catch (error) {
      console.log(error)
    }finally {
    setLoading(false);
    setEnteredData({
      official_id: "",
      department: "",
      badge_number: "",
      current_state: "",
      office_location: "",})
    }
  }
  return (
    <>
      <div className='min-h-screen w-full mx-auto max-w-11xl h-full flex items-center justify-center bg-teal-50' >

        <motion.img
          animate={{ scale: [0.5, 0.9] }}
          transition={{
            // repeat: Infinity,
            // repeatType: "loop",
            // duration: 5.5,
            // ease: "easeInOut",
            // type: "spring",
            // stiffness: 10,
            // damping: 5,
            // mass: 10
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
            className=" flex flex-col items-center justify-center gap-4 w-full h-full  p-2 ">
            <div className=' max-sm:text-3xl  md:text-4xl text 3xl:text-6xl font-semibold'>Verify As Agent</div>
            <div className='flex max-sm:w-[90%] sm:w-[55%] items-center justify-center flex-col gap-2'>
              <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Official Id" type="file" isRequired name="official_id" onChange={handleChange} />

              <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Department" type="text" isRequired name="department" value={enteredData.department} onChange={handleChange} />
              <div className='flex items-center justify-between w-full h-full gap-4'>
                <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Badge Number" type="text" isRequired name="badge_number" value={enteredData.badge_number} onChange={handleChange} />
                <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Current State" type="text" isRequired name="current_state" value={enteredData.current_state} onChange={handleChange} />
              </div>
              <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Office Location" type="text" isRequired name="office_location" value={enteredData.office_location} onChange={handleChange} />
              <Button isLoading={loading}
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
      } isDisabled={!isFormComplete} size='md' variant='shadow' color='success' radius='sm' fullWidth className='mt-2' onClick={handleSubmit}>SUBMIT</Button>

            </div>

          </motion.div>
        </div>
      </div>

    </>
  )
}

export default GOV_Verification