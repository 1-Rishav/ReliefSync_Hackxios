import React, { useEffect, useState } from "react";
import { Meteors } from "./ui/BoxEffect";
import { RiCheckDoubleFill } from "react-icons/ri";
import { Chip } from "@heroui/react";

export function AreaToday({ todayArea, newData }) {
  const dataArray = Array.isArray(todayArea) ? todayArea : [todayArea];
  const [selectedIndex, setSelectedIndex] = useState(() => {
    return localStorage.getItem("selectedIndex") || "";
  });

  useEffect(() => {
    const handleChange = () => {
      setSelectedIndex(localStorage.getItem("selectedIndex") || "");
    };

    window.addEventListener("selectedIndexChange", handleChange);
    return () => window.removeEventListener("selectedIndexChange", handleChange);
  }, []);

  const handleCheck = async (disasterType, riskLevel, severity, id) => {
    setSelectedIndex(null);
    const data = {
      disasterType,
      riskLevel,
      severity,
      id
    }
    newData(data)

    localStorage.setItem("selectedIndex", id)
    setSelectedIndex(id);

    // setSelectedIndex(onNextIndex);
    // localStorage.setItem("selectedIndex", onNextIndex)
  }

  return (
    <>
      {dataArray?.map((area, index) => (
        <div className="md:w-fit cursor-pointer max-md:w-[90%] p-1" key={index}>
          <div className="relative w-full ">
            <div onClick={() => handleCheck(area?.disasterType, area?.riskLevel, area?.severity, area?._id)}
              className="relative flex max-md:h-[200px] md:h-[250px] flex-col items-center justify-center rounded-2xl border border-gray-300 bg-gray-100 px-4 py-2 shadow-xl gap-1">
              {selectedIndex === area?._id && <div className="absolute bottom-0 right-0  h-10 w-10  rounded-full flex items-center justify-center bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 "><RiCheckDoubleFill /></div>}

              <div className="flex items-center justify-center h-fit w-full font-bold lg:text-xl md:text-lg sm:text-md max-sm:text-sm p-4">Today's Area</div>
              <div className='flex items-center justify-around max-lg:flex-col w-full p-1 max-lg:gap-4 overflow-y-scroll'>
                <div className='flex items-start justify-center flex-col gap-1 text-xl max-lg:text-lg max-sm:text-sm max-lg:pb-4 font-medium max-xl:font-normal md:mx-10 max-md:mx-5'>
                  <div className="text-lg max-lg:text-md max-sm:text-sm" >• Disaster Type: {area?.disasterType.toUpperCase()}</div>
                  <div>• RiskLevel: {area?.riskLevel >= 2 ? <span className='text-red-500'>{area?.riskLevel}</span> : area?.riskLevel}</div>
                  <div>• Severity: {area?.severity == "High" ? <span className='text-red-500'>{area?.severity}</span> : area?.severity}</div>
                </div>
              </div>
            </div>
          </div>
        </div>))}
    </>
  );
}

export function PendingTask({ todayTask }) {

  return (
    <div className="md:w-xl max-md:w-sm max-sm:w-2xs p-1">
      <div className="relative w-full ">
        <div
          className="relative flex max-md:h-[300px] md:h-[350px] flex-col items-center justify-center rounded-2xl border border-gray-300 bg-gray-100 px-4 py-2 shadow-xl gap-1 ">

          <div className="flex items-center justify-center h-fit w-full font-bold lg:text-xl md:text-lg sm:text-md max-sm:text-sm p-4">Today Task</div>
          <div className='flex items-center justify-around max-lg:flex-col w-full p-1 max-lg:gap-4 overflow-y-scroll'>
            <div className='border-4 border-green-200  rounded-xl '>
              <img src={todayTask?.[0]?.evidenceCID} alt="Affected area" className='rounded-xl object-cover max-h-40 max-w-40' />
            </div>
            <div className='flex items-start justify-center flex-col gap-1 text-xl max-lg:text-lg max-sm:text-sm max-lg:pb-4 font-medium max-xl:font-normal md:mx-10 max-md:mx-5'>

              <div >• Request For: <span className='text-red-500'>{todayTask?.[0]?.needType.toUpperCase()}</span></div>
              <div>• Fulfilled: {todayTask?.[0]?.needType == "funds" && todayTask?.[0]?.active &&
                <Chip color='warning' variant='flat'>Partial</Chip >}{todayTask?.[0]?.needType != "funds" && !todayTask?.[0]?.active && <Chip color='success' variant='flat'>Yes</Chip>}{todayTask?.[0]?.needType != "funds" && !todayTask?.[0]?.fulfilled && <Chip color='danger' variant='flat'>NO</Chip>}{todayTask?.[0]?.needType !== "funds" && todayTask?.[0]?.fulfilled && <Chip color='success' variant='flat'>YES</Chip>}</div>
              <div>• Active: {todayTask?.[0]?.active ? <Chip color='success' variant='flat'>YES</Chip> : <Chip color='success' variant='flat'>NO</Chip>}</div>
              <div>• Disaster Type: {todayTask?.[0]?.disasterType.toUpperCase()}</div>
              <div>• RiskLevel: {todayTask?.[0]?.riskLevel >= 2 ? <span className='text-red-500'>{todayTask?.[0]?.riskLevel}</span> : todayTask?.[0]?.riskLevel}</div>
              <div>• Severity: {todayTask?.[0]?.severity == "High" ? <span className='text-red-500'>{todayTask?.[0]?.severity}</span> : todayTask?.[0]?.severity}</div>
              <div>• Phone.NO: {todayTask?.[0]?.phone}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

