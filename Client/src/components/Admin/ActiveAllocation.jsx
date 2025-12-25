import { Divider, useDisclosure, Chip, Button, Tooltip } from '@heroui/react';
import React, { useEffect, useRef, useState } from 'react'
import { LuArrowUpToLine } from "react-icons/lu";
import { FaIndianRupeeSign, FaEthereum } from "react-icons/fa6";
import Spline from '@splinetool/react-spline';
import { HelpDetailModal, MapModal, TaskDetailModal } from '../Helper/Modals/DisasterRiskModal';
import { getAllDonation, getAllHelper, getProcessedRequests } from '../../ConnectContract/Web3Connection';
import { useDispatch, useSelector } from 'react-redux';
import { getQrCode } from '../../store/slices/disasterSlice';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react'
import FilterRequest from '../Common_Features/FilterRequest';
import NoData from '../Common_Features/NoData';
import LeftDrawer from '../Common_Features/LeftDrawer';

const bgColors = [
  "#ffffff",  // white
  "#fff0f5",  // lavender blush
  "#ffe4e1",  // misty rose
  "#fffacd",  // lemon chiffon
  "#e0ffff",  // light cyan
  "#e6e6fa",  // lavender
  "#f0fff0",  // honeydew
  "#f5f5dc",  // beige
  "#fafad2",  // light goldenrod yellow
  "#f0f8ff",  // alice blue
  "#f5fffa"   // mint cream
];

const imageArray = [
  'https://images.unsplash.com/photo-1558448495-5ef3fce92344?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1677233860259-ce1a8e0f8498?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1600336153113-d66c79de3e91?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1617585411149-54e9fdf60348?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1624087181434-46b1bf7edbfe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1692364221415-654b20e6d1d2?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1630661620103-765e82f19394?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1602980085374-7e743fff3cc6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

]

const ActiveAllocation = () => {
  //const [allData, setAllData] = useState(null)
  const [requestData, setRequestData] = useState([])
  const [donatedData, setDonatedData] = useState([])
  const [resourceData, setResourceData] = useState([])
  const [overviewData, setOverviewData] = useState([])
  const [requestType, setRequestType] = useState(null)
  const [selected, setSelected] = useState([]);
  const [donation, setDonation] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null)
  const imageRef = useRef(null);
  const imageDiv = useRef(null);
  const sectionRef = useRef(null);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();
  const { isOpen: openDetailModal, onOpen: detailModalTrigger, onOpenChange: changeDetailModal } = useDisclosure();
  const { isOpen: openDonatorModal, onOpen: donatorModalTrigger, onOpenChange: changeDonatorModal } = useDisclosure();

  const parseSelected = (selected) => {
    const filters = {};
    selected.forEach((item) => {
      const [category, value] = item.split(": ").map((s) => s.trim());

      if (category === "Disaster") filters.disasterType = value.toLowerCase();
      if (category === "Request") filters.needType = value.toLowerCase();
      if (category === "Risk Level") filters.riskLevel = Number(value);
    });
    return filters;
  };



  const applyFilters = (requestedData, selected) => {
    const filters = parseSelected(selected);

    return requestedData.filter((item) => {
      if (filters.disasterType && item.disasterType.toLowerCase() !== filters.disasterType) return false;
      if (filters.needType && item.needType.toLowerCase() !== filters.needType) return false;
      if (filters.riskLevel !== undefined && item.riskLevel !== filters.riskLevel) return false;
      return true;
    });
  };

  const filtered = applyFilters(requestData, selected);
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { role, _id: userId } = useSelector((state) => state.user);

  const handleLocation = (a, b) => {
    //const [lat, lng] = s.split(",").map(item => item.trim());

    const data = {
      lat: a,
      lng: b
    }
    setCoords(data)
    mapModalTrigger();
  }

  useEffect(() => {

    const getData = async () => {
      const undeliveredRequest = await getProcessedRequests();
      const goodsDonation = await getAllDonation();
      const filteredGoodsDonation = goodsDonation.filter((donation) => donation.donationType !== 'funds');
      const pendingRequest = undeliveredRequest.filter((req) => (!req.fulfilled && !req.allocated) && req.needType !== 'funds').length;
      const allocatedRequest = undeliveredRequest.filter((req) => req.allocated).length;
      const fundsRequest = undeliveredRequest.filter((req) => req.needType === 'funds').length;
      const totalRequest = undeliveredRequest.filter((req) => (req.active)).length;
      setOverviewData([
        { id: 0, title: "Pending", count: pendingRequest },
        { id: 1, title: "Allocated", count: allocatedRequest },
        { id: 2, title: "Funds", count: fundsRequest },
        { id: 3, title: "Total", count: totalRequest }]);
      setRequestData(undeliveredRequest)
      setDonation(filteredGoodsDonation)
      console.log("Undelivered Requests:", undeliveredRequest);
    }
    getData();
  }, [refresh]);

  const handleDetail = async (allData) => {
    let qrCode;
    if (allData.allocated) {
      qrCode = await dispatch(getQrCode({ id: Number(allData.id) }));
    }
    const data = {
      donationType: allData.needType,
      requestId: allData.id,
      role,
      qrImage: qrCode ? qrCode.data.qrCodeUrl : null,
      ...allData,
    }
    setRequestType(data);
    const donated = await getAllDonation()
    const filteredFundData = donated.filter((donation) => donation.userId === userId && donation.donationType == 'funds')
    setDonatedData(filteredFundData)
    const filteredResourceData = donated.filter((donation) => donation.requestId === allData.id && Math.floor(Date.now() / 1000) < Number(donation.validUntil));
    const helpers = await getAllHelper();
    for (let i = 0; i < filteredResourceData.length; i++) {
      const filteredHelpers = helpers.filter((helper) => helper.donationId == filteredResourceData[i]?.id);
      setResourceData(filteredHelpers)
    }

    detailModalTrigger();
  }
  const handledonation = async (donationData)=>{
    const data={
      ...donationData
    }
    setRequestType(data);
    donatorModalTrigger();
    }

  gsap.registerPlugin(ScrollTrigger);

  useGSAP(() => {
    let lastIndex = -1; // keep track of last image index

    gsap.to(imageDiv.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top 10%",
        end: "bottom 40%",
        //scrub: true, // smoother animation sync with scroll
        onUpdate: (ele) => {
          let imageIndex;
          if (ele.progress < 1) {

            imageIndex = Math.floor(ele.progress * imageArray.length);
          } else {
            imageIndex = imageArray.length - 1;
          }

          // ✅ Only update when index changes
          if (imageIndex !== lastIndex) {
            imageRef?.current && (imageRef.current.src = imageArray[imageIndex]);
            lastIndex = imageIndex;
          }
        },
      },
    });

  }, [imageArray]);

  useGSAP(() => {
    let lastIndex = -1; // keep track of last color index
    gsap.to(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const index = Math.floor(self.progress * (bgColors.length - 1));

          if (index !== lastIndex) {
            gsap.to(sectionRef.current, {
              backgroundColor: bgColors[index],
              duration: 0.5, // smooth transition
              overwrite: "auto"
            });
            lastIndex = index;
          }
        }
      }
    });
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scrolling
    });
  };

  return (
    <>
      {filtered?.length > 0 ? (
        <>
          <main className='relative mx-auto max-w-11xl bg-teal-50 h-full w-full flex items-start justify-between ' ref={sectionRef}>

            <div className='relative h-full max-lg:w-full lg:w-[70%] flex flex-col max-sm:text-sm sm:text-md md:text-lg  font-medium '>
              {/* xl:mx-40 lg:mx-32 md:mx-24 sm:mx-14 max-sm-10*/}
              <div className='w-[90%] mx-auto' ref={dropdownRef}>
                <FilterRequest open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
                <LeftDrawer allOverview={overviewData} />
                <Divider className='my-1 md:hidden' />
                {filtered?.map((data, index) => (
                  <div key={index}>

                    {data.active && <> <div className=' relative md:h-full max-md:h-52 w-full border-5 p-1 my-2 rounded-md '>
                      <div className='absolute inset-0 '>
                        <div className='absolute lg:h-[40%] md:h-[48%] max-md:h-[32%] max-sm:h-[30%]  md:w-[32%] lg:w-[25%] max-md:w-[44%] max-sm:w-[90%]  blur-[2px] bg-white rounded-tl-xl  bottom-0 right-0 '></div>

                        <Spline
                          //scene="https://prod.spline.design/19vkhsMOvXaLN8X4/scene.splinecode"
                          scene="https://prod.spline.design/oWIxdLDOFI8Z6ATf/scene.splinecode"
                        //scene="https://prod.spline.design/JL5jsKmpBhOh7TAx/scene.splinecode"
                        //scene="https://prod.spline.design/yxQVEPwLFt9SuZjo/scene.splinecode"
                        />
                      </div>

                      <div className='relative h-full w-full flex max-lg:flex-col overflow-y-scroll '>
                        <div className="hidden h-fit md:flex items-center justify-start absolute left-1/3 -translate-x-1/30 z-20">
                          <div className="max-md:hidden bg-transparent flex h-fit items-start justify-center px-2 py-1 rounded-full text-sm font-semibold shadow">
                            <span className='text-green-700 font-serif font-bold text-5xl'>⇒</span>
                          </div>
                        </div>
                        <div className='relative h-fit w-full max-md:flex-col flex max-md:items-center items-start justify-between max-sm:flex-wrap gap-1'>
                          <div onClick={(e) => { handleDetail({ ...data }); e.stopPropagation() }} className=' cursor-pointer max-md:order-2 flex items-start justify-center flex-col w-fit'>
                            <h2 className='text-xl font-medium mb-1'>Request ID: {Number(data.id)}</h2>
                            <p className=''>Name: {data.name}</p>
                            <p >Lat & Lon:- <span className='hover:underline hover:text-green-700 cursor-pointer' onClick={(e) => { e.stopPropagation(); handleLocation(data.latitude, data.longitude) }}>{Number(data.latitude).toFixed(2)},{Number(data.longitude).toFixed(2)}</span></p>
                            <p>Disaster:- {data.disasterType?.toUpperCase()}</p>
                            <p>Request For:- {data.needType?.toUpperCase()}</p>
                          </div>

                          <div className="md:hidden order-3 flex items-center justify-evenly relative z-20">
                            <div className="md:hidden bg-transparent flex h-fit items-center justify-center px-2 py-1 rounded-full text-sm font-semibold shadow">
                              <span className='text-green-700 font-serif font-bold rotate-90  text-5xl'>⇒</span>
                            </div>
                          </div>

                          {donation?.filter(donationData => donationData.requestId === data.id).map((donationData, index) => (
                            <div key={index} onClick={(e)=>{handledonation({...donationData});e.stopPropagation()}} className='max-md:order-4 flex items-start text-justify flex-col w-fit'>
                              <h2 className='text-xl font-medium mb-1'>Donor ID: {Number(donationData.id)}</h2>
                              <p className=''>Organization: {donationData.name}</p>
                              <p>Role:- {donationData.donorRole?.toUpperCase()}</p>
                              <div>Delivered:- {donationData.delivered ?
                                (<Chip color='success' variant='flat'>Yes</Chip>) : (<Chip color='danger' variant='flat'>NO</Chip>)}</div>
                                {donationData.helpRequired ? (<p> Helper Count:- {donationData.helpers.length}</p>):(<div>Help Required:- <Chip color='danger' variant='flat'>No</Chip></div> )}
                            </div>
                          ))}

                          <div className='flex sm:gap-1 max-sm:gap-1 items-center justify-between flex-col'>
                            <div className='flex sm:gap-2 max-sm:gap-2 items-center justify-between md:flex-col'>
                              {!data.fulfilled && (<Chip color='danger' variant='faded'>Pending</Chip>)}

                              {!data.isFunds && data.fulfilled && <Chip color='success' variant='flat'>Delivered</Chip>}

                              {data?.allocated && <Chip color='warning' variant='flat'>Allocated</Chip>}

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    </>}

                  </div>
                ))}

                <Divider className='my-4' />
              </div>
            </div>
            <div className='max-sm:hidden sticky top-0 h-screen flex flex-col items-center justify-evenly max-2xl:w-[28%] w-[28%]'>
              <div className='absolute inset-0 -z-10000 bg-transparent blur-[4px]'>
                <div className='absolute h-[10%] max-md:h-[10%]  md:w-[95%] max-md:w-[90%] max-sm:w-[98%]  blur-[2px] bg-white  bottom-0 right-0 '></div>
                <Spline
                  //scene="https://prod.spline.design/19vkhsMOvXaLN8X4/scene.splinecode"
                  //scene="https://prod.spline.design/oWIxdLDOFI8Z6ATf/scene.splinecode"
                  scene="https://prod.spline.design/JL5jsKmpBhOh7TAx/scene.splinecode"
                //scene="https://prod.spline.design/yxQVEPwLFt9SuZjo/scene.splinecode"
                />
              </div>
              <div ref={imageDiv} className='mt-5 flex items-center justify-center h-1/2 w-fit'>
                <img
                  ref={imageRef}
                  src={imageArray[0] || "https://via.placeholder.com/200"}
                  alt="disaster image"
                  className='md:h-60 md:w-48 lg:h-72 lg:w-56 xl:h-80 xl:w-64 sm:h-60 sm:w-40 rounded-2xl'
                />
              </div>

              <div className='sticky bottom-10'>
                {showButton && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LuArrowUpToLine
                      onClick={scrollToTop}
                      className='cursor-pointer h-16 w-16 rounded-full p-3 bg-gray-300 text-gray-600 hover:bg-gray-400 hover:text-white border-2'
                    />
                  </motion.div>
                )}
              </div>
            </div>

          </main>
        </>
      ) : (
        <>
          <NoData />
        </>
      )

      }

      <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />
      <HelpDetailModal isOpen={openDetailModal} onOpenChange={changeDetailModal} requestType={requestType} refreshData={setRefresh} donationData={donatedData} allHelper={resourceData} />
      <TaskDetailModal isOpen={openDonatorModal} onOpenChange={changeDonatorModal} requestType={requestType} />
    </>
  )
}

export default ActiveAllocation