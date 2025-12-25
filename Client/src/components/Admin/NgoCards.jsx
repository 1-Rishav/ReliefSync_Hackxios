import React, { useState } from "react";
import { Meteors } from "../ui/BoxEffect";
import { MdPictureAsPdf } from "react-icons/md";
import { RiCheckDoubleFill } from "react-icons/ri";
import axios from "../../utils/axios";
import { toast } from "react-toastify";


export function NgoCards({ name, Website, SocialMedia, registered_address, registrationType, registrationNumber, stateORcity, founder_name, phone, document, id, is_verified }) {
  const [doubleChecked, setdoubleChecked] = useState(false)


  const handleCheck = async ({ id }) => {

    try {
      const data = {
        ngoId: id,
      }
      const response = await axios.post('/admin/verifyNGO', data, { withCredentials: true });
      toast.success(response.data.message)
      if (response.status == 200) {
        setdoubleChecked(true);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <div className="md:w-md max-md:w-sm max-sm:w-2xs p-1 ">
      <div className="relative w-full">
        <div
          className="absolute inset-0 h-full w-full  scale-[0.70] transform rounded-full  bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />


        <div onDoubleClick={() => handleCheck({ id })}
          className="relative flex h-[270px] flex-col items-start  justify-start rounded-2xl border border-gray-300 bg-gray-100 px-4 py-5 shadow-xl ">
          {(is_verified || doubleChecked) && <div className="absolute bottom-0 right-0  h-10 w-10  rounded-full flex items-center justify-center bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 "><RiCheckDoubleFill /></div>}

          <div className=" overflow-x-hidden  overflow-y-scroll ">
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Org:-{name}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Website:-{Website}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Social Media:-{SocialMedia}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Address:-{registered_address}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Type:-{registrationType}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Reg. Number:-{registrationNumber}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              State/City:-{stateORcity}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Founder:-{founder_name}
            </h1>
            <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
              Phone no.:-{phone}
            </h1>

            <a href={document} target="_blank" className="rounded-lg  ">
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
