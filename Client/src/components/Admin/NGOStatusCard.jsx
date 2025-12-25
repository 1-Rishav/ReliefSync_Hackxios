import React from "react";
import { Meteors } from "../ui/BoxEffect";
import { MdPictureAsPdf } from "react-icons/md";
import { Chip } from "@heroui/react";


export function NgoStatusCard({ name, Website, registered_address, registrationType, stateORcity, founder_name, phone, document, status}) {

    return (
        <div className="md:w-md max-md:w-sm max-sm:w-2xs p-1 ">
            <div className="relative w-full">
                <div
                    className="absolute inset-0 h-full w-full  scale-[0.70] transform rounded-full  bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
                <div
                    className="relative flex h-[270px] flex-col items-start  justify-start rounded-2xl border border-gray-300 bg-gray-100 px-4 py-5 shadow-xl ">

                    <div className="flex flex-col items-end justify-end  w-full h-fit">
                        {status ? (<h1 className="text-xl font-medium text-black font-serif"><Chip size="lg"
                            color="success"
                            variant="dot" >Active</Chip></h1>) : (
                            <h1 className="text-xl font-medium text-black font-serif"><Chip size="lg"
                                color="danger"
                                variant="dot" >Inactive</Chip></h1>
                        )}


                    </div>
                    <div className=" overflow-x-hidden  overflow-y-scroll ">
                        <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
                            Org:-{name}
                        </h1>
                        <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
                            Website:-{Website}
                        </h1>
                        <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
                            Address:-{registered_address}
                        </h1>
                        <h1 className="relative z-5 mb-2 text-xl font-bold text-black">
                            Type:-{registrationType}
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
