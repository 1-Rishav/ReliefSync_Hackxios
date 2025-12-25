import React, { useRef, useState } from 'react'
import { motion, spring, easeInOut } from 'motion/react'
import { Button, Input } from '@heroui/react'
import UserAvatar from './UserAvatar'
import { MdOutlineEdit } from "react-icons/md";
import { Chip, Divider } from "@heroui/react";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAccount, editProfile, editUser } from '../../store/slices/userSlice';
import { logOut } from '../../store/slices/authSlice';
import ToggleHelp from './ToggleHelp';
const UserProfile = () => {

  const [changePass, setChangePass] = useState(true);
  const [changeName, setChangeName] = useState(true);
  const [changeEmail, setChangeEmail] = useState(true);
  const [file, setFile] = useState(null);
  const [enteredValue, setEnteredValue] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const fileInputRef = useRef(null);

  const { email, firstName, lastName, verified, password, profile, role, createdAt, updatedAt, ngo_verified, agent_verified } = useSelector((state) => state.user)


  useEffect(() => {
    setEnteredValue((prev) => ({
      ...prev,
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      password: password || ''
    }));
  }, [firstName, lastName, email, password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnteredValue((prev => ({ ...prev, [name]: value })))
  }

  const handleName = (e, field) => {
    if (e.key === "Enter") {
      handleSubmitName(field, e.target.value);

    }
  };
  const handleEmail = (e, field) => {
    if (e.key === "Enter") {
      handleSubmitEmail(field, e.target.value);

    }
  };
  const handlePass = (e, field) => {
    if (e.key === "Enter") {
      handleSubmitPass(field, e.target.value);

    }
  };

  const handleSubmitName = async (field, value) => {
    setEnteredValue((prev) => ({ ...prev, [field]: value }));
    const data = {
      ...enteredValue
    }
    await dispatch(editUser(data, { req: 'changeName' }))
    setChangeName(!changeName)
  }
  const handleSubmitEmail = async (field, value) => {
    setEnteredValue((prev) => ({ ...prev, [field]: value }));
    const data = {
      email: enteredValue.email
    }
    await dispatch(editUser(data, { req: 'changeEmailOrPass' }))
    setChangeEmail(!changeEmail)
  }
  const handleSubmitPass = async (field, value) => {
    setEnteredValue((prev) => ({ ...prev, [field]: value }));
    const data = {
      password: enteredValue.password
    }
    await dispatch(editUser(data, { req: 'changeEmailOrPass' }))
    setChangePass(!changePass)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Save the file
    }
  };

  const handleProfile = (e) => {
    if (e.key === "Enter" && file) {
      handleSubmitProfile('profile', file);
    }

  };

  const handleSubmitProfile = async (field, file) => {
    const formData = new FormData();

    // Only append file once under the expected field name
    formData.append(field, file);

    // ✅ You cannot directly console FormData, this will help:
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value); // Should print: "profile", [File object]
    // }
    await dispatch(editProfile(formData));
  };


  const dispatch = useDispatch();
  const name = `${firstName} ${lastName}`;
  const createdDate = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const updatedDate = new Date(updatedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleAccount = async () => {

    await dispatch(deleteAccount())
    await dispatch(logOut())
  }

  return (
    <>
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
        className=" flex flex-col items-center justify-center gap-4 w-full h-full mx-auto max-w-11xl bg-teal-50 p-2 mt-16">
        <div className=' max-sm:text-3xl  md:text-4xl text 3xl:text-6xl font-bold font-serif tracking-wider'>Profile</div>
        <Divider className='my-8' />
        <div className=" flex max-md:flex-col md:items-start max-md:items-center justify-around md:gap-4 w-full h-full  p-2 md:mt-5">

          <div className="group relative flex md:order-2 md:w-[40%] lg:w-[26%] max-md:w-[75%] max-sm:w-[90%] items-start justify-center max-md:h-[60vh] md:h-[65vh]" tabIndex={0}
            onKeyDown={handleProfile}>
            <div className="relative border-2 rounded-lg border-gray-200 bg-gray-100 h-full w-full overflow-hidden">
              {/* Avatar Image */}
              <img
                className="h-full w-full rounded-lg object-cover transition duration-300 ease-in-out group-hover:blur-sm"
                src={profile || 'placeholder-avatar.png'}
                alt="UserAvatar"
              />

              {/* Icon Overlay */}
              <span
                className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 group-hover:backdrop-blur-sm transition-all duration-300 cursor-pointer"
                tabIndex={0}
                role="button"
                onClick={() => fileInputRef.current.click()}
              >
                <MdOutlineEdit className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={40} />
              </span>

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className='flex max-md:flex-col items-center justify-center gap-2 max-md:w-full md:w-[50%] h-full'>

            <div className=' relative flex max-md:w-[90%] md:w-[80%] lg:w-[60%] items-center justify-center flex-col gap-2  '>
              <div className='max-md:absolute flex max-md:flex-col max-md:-top-28 max-sm:left-2 max-md:left-5  max-md:items-start max-md:justify-start md:items-center md:justify-start max-md:w-fit w-full h-full max-md:h-fit md:gap-5'>
                <div><UserAvatar img={profile} width={110} height={110} /></div>
                <div className='flex flex-col items-start justify-center w-fit h-fit gap-2'>
                  {verified && (<Chip color="success" radius='full' variant='flat' size='lg' className='p-2 font-bold text-xl font-serif '>Verified</Chip>)}
                  {role === 'ngo' && ngo_verified && (<Chip color="success" radius='full' variant='flat' size='lg' className='p-2 font-bold text-xl font-serif '>NGO: Verified</Chip>)}
                  {role === 'gov_Agent' && agent_verified && (<Chip color="success" radius='full' variant='flat' size='lg' className='p-2 font-bold text-xl font-serif '>Agent: Verified</Chip>)}


                </div>
              </div>
              {changeName ? (<>
                <div className=' group flex items-start justify-start w-full h-full gap-4 max-sm:text-2xl sm:text-3xl md:text-5xl font-bold font-serif tracking-wider  max-md:mt-20'>
                  {name}
                  <div className='hidden group-hover:block cursor-pointer' onClick={() => setChangeName(!changeName)}><MdOutlineEdit size={40} /></div>
                </div>
              </>) : (<>
                <div className='flex w-full items-center justify-between gap-8 max-md:mt-5'>
                  <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="First Name" type="text" name="firstName" isRequired value={enteredValue.firstName}
                    onChange={handleChange}
                    onKeyDown={(e) => handleName(e, enteredValue.firstName)}

                    autoFocus />
                  <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Last Name" type="text" name="lastName"
                    value={enteredValue.lastName}
                    onChange={handleChange}
                    onKeyDown={(e) => handleName(e, enteredValue.lastName)}

                  />
                </div>
              </>)}

              {changeEmail ? (<>
                <div className='group flex flex-wrap items-start justify-start w-full h-full gap-4 max-sm:text-lg sm:text-xl md:text-2xl font-bold font-serif tracking-wider leading-10'>
                  Email: {email}
                  <span className='hidden group-hover:block flex-wrap cursor-pointer' onClick={() => setChangeEmail(!changeEmail)}><MdOutlineEdit size={30} /></span>
                </div>
              </>) : (<>
                <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Email" type="email" isRequired name="email"
                  value={enteredValue.email}
                  onChange={handleChange}
                  onKeyDown={(e) => handleEmail(e, enteredValue.email)}

                  autoFocus />

              </>)}
              <Divider className='my-8' />
              {changePass ? (<>
                <div className='group flex items-start justify-start w-full h-full gap-4 max-sm:text-lg sm:text-xl md:text-2xl font-bold font-serif tracking-wider leading-10'>
                  Password: ************
                  <div className='hidden group-hover:block cursor-pointer' onClick={() => setChangePass(!changePass)}><MdOutlineEdit size={30} /></div>
                </div>
              </>) : (<>
                <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Password" type="text" isRequired name="password"
                  value={enteredValue.password}
                  onChange={handleChange}
                  onKeyDown={(e) => handlePass(e, enteredValue.password)}

                  autoFocus />

              </>)}
              <div className='flex items-start justify-start w-full h-full gap-4 max-sm:text-xl sm:text-2xl md:text-3xl font-bold font-serif tracking-wider'>
                Role: {role}
              </div>
              <Divider className='my-8' />
              <div className='flex items-start justify-start w-full h-full gap-4 max-sm:text-xl sm:text-2xl md:text-3xl font-bold font-serif tracking-wider'>
                Created at: {createdDate}
              </div>
              <div className='flex items-start justify-start w-full h-full gap-4 max-sm:text-xl sm:text-2xl md:text-3xl font-bold font-serif tracking-wider '>
                Update at: {updatedDate}
              </div>

              <Divider className='my-8' />
              {(role == 'ngo' || role == 'gov_Agent') && <ToggleHelp />}

              <Button color="danger" radius='sm' variant='ghost' size='lg' className=' font-bold text-xl font-serif flex items-center justify-center ' onClick={handleAccount}>Delete Account</Button>
            </div>

          </div>
        </div>

      </motion.div>
    </>
  )
}

export default UserProfile