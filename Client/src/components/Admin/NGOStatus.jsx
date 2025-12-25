import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { TextHoverEffect } from "../ui/TextHoverEffect";
import { NgoStatusCard } from './NGOStatusCard';
import { useDispatch } from 'react-redux';
import { getAllNGO } from '../../store/slices/authSlice';

const NGOStatus = () => {
  const [ngos, setNgos] = useState([]);

  const dispatch = useDispatch();
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await dispatch(getAllNGO());
          setNgos(response.data);
        } catch (error) {
          toast.error(error.message);
        }
      };
  
      fetchData();
    }, [])

  return (
    <>

      <div className='flex items-center justify-center min-h-screen h-full w-full  transform mx-auto max-w-11xl bg-gradient-to-r from-blue-100 to-teal-100 overflow-y-scroll '>
        {ngos.length == 0 ?
          <div className='flex  flex-wrap gap-6 justify-around h-full min-h-screen w-full md:w-[70%]   bg-neutral-100 rounded-lg'><TextHoverEffect text="No NGO's" /></div> : <div className='flex  flex-wrap gap-6 justify-around h-full min-h-screen w-full md:w-[70%] pt-20  bg-neutral-100 rounded-xl '>
            {ngos.map((data) => (
              <div key={data._id} >

                <NgoStatusCard name={data.ngo_Name} Website={data.website} registered_address={data.registeredAddress} registrationType={data.registrationType}  stateORcity={data.stateORcity} founder_name={data.founderName} phone={data.phone} document={data.Official_docs} status={data.status}/>

              </div>
            ))}


          </div>}

      </div>
    </>
  )
}

export default NGOStatus