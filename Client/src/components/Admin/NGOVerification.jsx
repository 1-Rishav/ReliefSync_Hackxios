import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { TextHoverEffect } from "../ui/TextHoverEffect";
import { NgoCards } from './NgoCards';

const NGOVerification = () => {
  const [ngos, setNgos] = useState({ ngo: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/admin/getAllNGO', { withCredentials: true });

        const data = await response.data;
        setNgos(data);
        toast.success(data.message);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, [])

  return (
    <>

      <div className='flex items-center justify-center min-h-screen h-full w-full  transform mx-auto max-w-11xl bg-gradient-to-r from-blue-100 to-teal-100 overflow-y-scroll '>
        {ngos?.ngo?.length == 0 ?
          <div className='flex  flex-wrap gap-6 justify-around h-full min-h-screen w-full md:w-[70%]   bg-neutral-100 rounded-lg'><TextHoverEffect text="No NGO's" /></div> : <div className='flex  flex-wrap gap-6 justify-around h-full min-h-screen w-full md:w-[70%] pt-20  bg-neutral-100 rounded-xl '>
            {ngos?.ngo?.map((data) => (
              <div key={data._id} >

                <NgoCards name={data.ngo_Name} Website={data.website} SocialMedia={data.media_link} registered_address={data.registeredAddress} registrationType={data.registrationType} registrationNumber={data.registrationNumber} stateORcity={data.stateORcity} founder_name={data.founderName} phone={data.phone} document={data.Official_docs} id={data._id} is_verified={data.is_verified} />

              </div>
            ))}


          </div>}

      </div>
    </>
  )
}

export default NGOVerification