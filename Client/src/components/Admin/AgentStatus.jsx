import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { TextHoverEffect } from "../ui/TextHoverEffect";
import { useDispatch } from 'react-redux';
import { getAllAgent } from '../../store/slices/authSlice';
import { AgentStatusCard } from './AgentStatusCard';

const AgentStatus = () => {
  const [agents, setAgents] = useState([]);

    const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getAllAgent());
        setAgents(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, [])
  return (
    <>

      <div className='flex items-center justify-center min-h-screen h-full mx-auto w-full max-w-11xl transform bg-gradient-to-r from-blue-100 to-teal-100 overflow-y-scroll '>
        {agents?.length == 0 ?
          <div className='flex  flex-wrap gap-6 justify-around h-full min-h-screen w-full md:w-[70%]   bg-neutral-100 rounded-lg'><TextHoverEffect text="No Agent's" /></div> : <div className='flex  flex-wrap gap-6 justify-around h-full min-h-screen w-full md:w-[70%] pt-20  bg-neutral-100 rounded-xl '>
            {agents?.map((data) => (
              <div key={data._id} >

                <AgentStatusCard name={data.name} email={data.email} department={data.department} Office_location={data.office_location} current_state={data.current_state} badge_number={data.badge_number} official_id={data.official_id} status={data.status} />

              </div>
            ))}


          </div>}

      </div>
    </>
  )
}

export default AgentStatus