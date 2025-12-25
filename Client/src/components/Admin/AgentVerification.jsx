import React, { useEffect, useState } from 'react'
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { TextHoverEffect } from "../ui/TextHoverEffect";
import { AgentCards } from './AgentCards';

const AgentVerification = () => {
  const [agents, setAgents] = useState({ agent: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/admin/getAllAgent', { withCredentials: true });
        const data = await response.data;
        setAgents(data);
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
        {agents?.agent?.length == 0 ?
          <div className='flex  flex-wrap gap-6 justify-around h-full min-h-screen w-full md:w-[70%]   bg-neutral-100 rounded-lg'><TextHoverEffect text="No Agent's" /></div> : <div className='flex  flex-wrap gap-6 justify-around h-full min-h-screen w-full md:w-[70%] pt-20  bg-neutral-100 rounded-xl '>
            {agents?.agent?.map((data) => (
              <div key={data._id} >

                <AgentCards name={data.name} email={data.email} department={data.department} Office_location={data.office_location} current_state={data.current_state} badge_number={data.badge_number} official_id={data.official_id} is_verified={data.is_verified} id={data._id} />

              </div>
            ))}


          </div>}

      </div>
    </>
  )
}

export default AgentVerification