import React, { useState } from "react";
import { Meteors } from "../ui/BoxEffect";
import { MdPictureAsPdf } from "react-icons/md";
import { RiCheckDoubleFill } from "react-icons/ri";
import axios from "../../utils/axios";
import { toast } from "react-toastify";


export function AgentCards({ name, email, department, Office_location, current_state, badge_number, official_id, is_verified, id }) {
  const [doubleChecked, setdoubleChecked] = useState(false)


  const handleCheck = async ({ id }) => {

    try {
      const data = {
        agentId: id,
      }

      const response = await axios.post('/admin/verifyAgent', data, { withCredentials: true });
      toast.success(response.data.message)
      if (response.status == 200) {
        setdoubleChecked(true);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="md:w-md max-md:w-sm max-sm:w-2xs p-1">
      <div className="relative w-full ">
        <div
          className="absolute inset-0 h-full w-full scale-[0.70] transform rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />


        <div onDoubleClick={() => handleCheck({ id })}
          className="relative flex h-[270px] flex-col items-start justify-start rounded-2xl border border-gray-300 bg-gray-100 px-4 py-5 shadow-xl ">
          {(is_verified || doubleChecked) && <div className="absolute bottom-0 right-0  h-10 w-10  rounded-full flex items-center justify-center bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 "><RiCheckDoubleFill /></div>}

          <div className=" overflow-x-hidden  overflow-y-scroll ">
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Name:-{name}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Email:-{email}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Department:-{department}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Office:-{Office_location}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              State/City:-{current_state}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Badge Number:-{badge_number}
            </h1>


            <a href={official_id} target="_blank" className="rounded-lg  ">
              <MdPictureAsPdf size={30} />
            </a>
          </div>

          {/* Meaty part - Meteor effect */}
          <Meteors number={5} />
        </div>
      </div>
    </div>
  );
}
