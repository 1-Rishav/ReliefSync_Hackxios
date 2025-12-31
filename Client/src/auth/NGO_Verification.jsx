import React, { useState } from 'react'
import { motion, easeInOut, spring } from 'motion/react'
import { Button, Input, Select, SelectSection, SelectItem } from '@heroui/react'
import { useDispatch } from 'react-redux'
import { ngoEntry } from '../store/slices/authSlice'
import BackLogo from '../assets/Auth_back.png'
import logo from '../assets/Logo.png'

export const registeredType = [
  { key: "charitable_trust", label: "Charitable Trust" },
  { key: "society", label: "Society Association" },
  { key: "section_8_company", label: "Section 8 Company (India)" },
  { key: "non_profit_company", label: "Non-Profit Company" },
  { key: "501c3", label: "501(c)(3) Org (USA)" },
  { key: "public_charity", label: "Public Charity" },
  { key: "community_org", label: "Community-Based Org" },
  { key: "disaster_relief", label: "Disaster Relief NGO" },
  { key: "environmental_ngo", label: "Environmental NGO" },
  { key: "food_bank", label: "Food Bank NGO" },
  { key: "homeless_shelter", label: "Homeless Shelter NGO" },
]
const NGO_Verification = () => {
  const [enteredData , setEnteredData] = useState({
    ngo_Name:"",
    registrationNumber:"",
    registrationType:"",
    stateORcity:"",
    registeredAddress:"",
    officialEmail:"",
    phone:"",
    founderName:"",
    website:"",
    media_link:"",
    Official_docs:""

  })
  const [loading , setLoading]=useState(false);

  const dispatch = useDispatch();


  const handleChange = (e)=>{
    const {name , value , files}=e.target;
    if (name === "Official_docs") {
    setEnteredData(prev => ({ ...prev, [name]: files[0] })); // Store the first selected file
  } else {
    setEnteredData(prev => ({ ...prev, [name]: value }));
  }
  }
  let isFormComplete = true;

  Object.entries(enteredData).forEach(([key, value]) => {
    const trimmed = typeof value ==='string'?value?.trim?.():"";

    const alwaysRequired = ["ngo_Name", "registrationNumber", "registrationType", "stateORcity", "registeredAddress", "officialEmail", "phone", "founderName", "website", "media_link", ];
    if (alwaysRequired.includes(key) && trimmed === "") {
      isFormComplete = false;
    }

    if(key==="Official_docs"){
      if(!(value instanceof File)){
        isFormComplete=false;
      }
    }
    if (key === "phone") {
      if (trimmed?.length !== 10) {
        isFormComplete = false;
      }
    }
  })

  const handleSubmit = async()=>{
    setLoading(true);
    const formData = new FormData();

// Append entered values (text fields)
Object.entries(enteredData).forEach(([key, value]) => {
  if(key !=="Official_docs")
  formData.append(key, value);
});

// Append file separately
if (enteredData.Official_docs instanceof File) {
  formData.append('Official_docs', enteredData.Official_docs ); // Ensure file is a valid File object
}
    //setEnteredData("");
    try {
      await dispatch(ngoEntry(formData))
    } catch (error) {
      console.log(error)
    } finally {
    setLoading(false);
setEnteredData({
    ngo_Name:"",
    registrationNumber:"",
    registrationType:"",
    stateORcity:"",
    registeredAddress:"",
    officialEmail:"",
    phone:"",
    founderName:"",
    website:"",
    media_link:"",
    Official_docs:""
})
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
        <div className=' max-sm:text-3xl  md:text-4xl text 3xl:text-6xl font-semibold'>Verify As NGO</div>
        <div className='flex max-sm:w-[90%] sm:w-[55%] items-center justify-center flex-col gap-2'>
          <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="NGO Name" type="text" isRequired name="ngo_Name" value={enteredData.ngo_Name} onChange={handleChange} />
          <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Registration Number" type="text" isRequired name="registrationNumber" value={enteredData.registrationNumber} onChange={handleChange}/>
          <div className='flex items-center justify-between w-full h-full gap-4'>
            <Select className=' flex items-center justify-center ' label="Type of Registration" isRequired variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' name="registrationType" value={enteredData.registrationType} onChange={handleChange} selectedKeys={enteredData.registrationType ? [enteredData.registrationType] : []}>
              {registeredType.map((registration) => (
                <SelectItem key={registration.key}>{registration.label}</SelectItem>
              ))}
            </Select>

            <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="State/City" type="text" isRequired name="stateORcity" value={enteredData.stateORcity} onChange={handleChange}/>
          </div>
          <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Registered Address" type="text" isRequired name="registeredAddress" value={enteredData.registeredAddress} onChange={handleChange}/>
          <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Official Email ID" type="email" isRequired name="officialEmail" value={enteredData.officialEmail} onChange={handleChange}/>
          <div className='flex items-center justify-between w-full h-full gap-4'>
            <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Phone Number" type="number" isRequired name="phone" value={enteredData.phone} onChange={handleChange} isInvalid={enteredData.phone.trim().length > 0 && enteredData.phone.trim().length !== 10}
                errorMessage={
                  enteredData.phone.trim().length > 0 && enteredData.phone.trim().length !== 10
                    ? "Phone number must be 10 digits"
                    : ""
                }/>
            <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Founder Name" type="text" isRequired name="founderName" value={enteredData.founderName} onChange={handleChange}/>
          </div>

          <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Website" type="text" isRequired name="website" value={enteredData.website} onChange={handleChange}/>
          <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Social Media Links" type="text" isRequired name="media_link" value={enteredData.media_link} onChange={handleChange}/>
          <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Official Document" type="file" isRequired name="Official_docs"  onChange={handleChange}/>
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
      } isDisabled={!isFormComplete} size='md' variant='shadow' color='success' radius='sm' fullWidth onClick={handleSubmit} className='mt-4'>SUBMIT</Button>
          
        </div>
      </motion.div>
        </div>
      </div>
      
    </>
  )
}

export default NGO_Verification