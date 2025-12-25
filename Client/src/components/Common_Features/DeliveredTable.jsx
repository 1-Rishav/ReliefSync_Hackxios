import { Button, Divider, useDisclosure } from '@heroui/react';
import React, { useEffect, useState, useRef } from 'react'
import { FaIndianRupeeSign, FaEthereum } from "react-icons/fa6";
import { Chip } from '@heroui/react';
import Spline from '@splinetool/react-spline';
import { DeliveredDetailModal, MapModal } from '../Helper/Modals/DisasterRiskModal';
import { getAllHelper, getProcessedRequests } from '../../ConnectContract/Web3Connection';
import { useSelector } from 'react-redux';
import { formatEther } from 'viem';
import FilterRequest from './FilterRequest';
import { ScrollTrigger } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Feedback from '../Helper/Modals/FeedbackModel';
import NoData from './NoData';
import LeftDrawer from './LeftDrawer';

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

const DeliveredTable = () => {

  const [requestData, setRequestData] = useState([])
  const [requestType, setRequestType] = useState(null)
  const [donatedData, setDonatedData] = useState([])
  const [resourceData, setResourceData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [overviewData, setOverviewData] = useState([]);
  const [active, setActive] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();
  const { isOpen: openDetailModal, onOpen: detailModalTrigger, onOpenChange: changeDetailModal } = useDisclosure();
  const { isOpen: openFeedBackModal, onOpen: feedBackModalTrigger, onOpenChange: changeFeedBackModal } = useDisclosure();
  const [coords, setCoords] = useState(null)

  const imageRef = useRef(null);
  const imageDiv = useRef(null);
  const sectionRef = useRef(null);
  const dropdownRef = useRef(null);

  const { role, _id: userId, feedback } = useSelector((state) => state.user);


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


  const handleSelect = (a, b) => {
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
      const deliveredRequest = await getProcessedRequests();
      const allRequest = deliveredRequest.filter((req) => req.active === false);
      const delivered = allRequest.filter((req) => !req.isFunds && req.fulfilled === true).length;
      const failed = allRequest.filter((req) => !req.isFunds && req.fulfilled === false).length;
      const fundsDonation = allRequest.filter((req) => req.needType === 'funds').length;
      setOverviewData([
        { id: 0, title: "Delivered", count: delivered },
        { id: 1, title: "Failed", count: failed },
        { id: 2, title: "Funds Donations", count: fundsDonation },
        { id: 3, title: "Total", count: allRequest.length }
      ])
      setRequestData(allRequest)
    }
    getData();
  }, [refresh])

  const handlePersonal = async () => {
    const personalRequests = requestData.filter((req) => req.userId === userId);
    setRequestData(personalRequests);
    setActive("personal");
  }

  const handleOther = async () => {

    const filteredData = requestData.filter((req) => req.userId !== userId)
    setRequestData(filteredData);
    setActive("other");
  }

  const handleDetail = async (allData) => {
    const data = {
      donationType: allData.needType,
      requestId: allData.id,
      role,
      ...allData,

    }
    setRequestType(data);
    const filteredData = requestData.filter((donation) => donation.userId === userId && donation.donationType == 'funds')
    setDonatedData(filteredData)
    const filteredResourceData = requestData.filter((donation) => donation.requestId === allData.id && Math.floor(Date.now() / 1000) < Number(donation.validUntil));
    const helpers = await getAllHelper();
    for (let i = 0; i < filteredResourceData.length; i++) {
      const filteredHelpers = helpers.filter((helper) => helper.donationId == filteredResourceData[i]?.id);
      setResourceData(filteredHelpers)
    }
    detailModalTrigger();
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

  const handleFeedBack = async (disasterType, deliveredId) => {
    const data = {
      disasterType,
      deliveredId
    }
    setRequestType(data);
    feedBackModalTrigger();
  }

  return (
    <>
      {filtered?.length > 0 ? (
        <><main className='relative h-full w-full mx-auto max-w-11xl bg-teal-50 flex items-start justify-between' ref={sectionRef}>
          <div className='relative h-full max-lg:w-full lg:w-[70%] flex flex-col max-sm:text-sm sm:text-sm lg:text-lg  font-medium ' >
            {/* xl:mx-40 lg:mx-32 md:mx-24 sm:mx-14 max-sm-10  */}
            <div className='w-[90%] mx-auto' ref={dropdownRef}>
              <FilterRequest open={open} setOpen={setOpen} selected={selected} setSelected={setSelected} />
              <div className='md:hidden w-full h-full flex  items-center justify-end gap-5'>
                <Button size='md' variant='flat' color={active === "personal" ? "secondary" : "success"} radius='sm' onClick={handlePersonal} className='mt-1 xl:text-2xl font-serif font-medium'>Your Req</Button>
                <Button size='md' variant='flat' color={active === "other" ? "secondary" : "success"} radius='sm' onClick={handleOther} className='mt-1 xl:text-2xl font-serif font-medium'>Other Req</Button>
              </div>
              <LeftDrawer allOverview={overviewData} />
              <Divider className='my-1 md:hidden' />
              {filtered?.map((data, index) => (
                <div key={index}>
                  {!data.active && <> <div key={index} onClick={() => handleDetail({ ...data })} className=' cursor-pointer relative h-full w-full border-5 px-1 my-2 rounded-md '>
                    <div className='absolute inset-0 '>
                      <div className='absolute h-[50%] max-md:h-[45%] max-sm:h-[28%]  md:w-[37%] max-md:w-[38%] max-sm:w-[90%]  blur-[2px] bg-white rounded-tl-xl  bottom-0 right-0 '></div>
                      <Spline
                        //scene="https://prod.spline.design/19vkhsMOvXaLN8X4/scene.splinecode"
                        scene="https://prod.spline.design/oWIxdLDOFI8Z6ATf/scene.splinecode"
                      //scene="https://prod.spline.design/JL5jsKmpBhOh7TAx/scene.splinecode"
                      //scene="https://prod.spline.design/yxQVEPwLFt9SuZjo/scene.splinecode"
                      />
                    </div>
                    <div className='relative h-full w-full flex flex-col'>
                      <div className='relative h-full w-full max-sm:flex-col flex max-sm:items-center items-start justify-evenly max-sm:flex-wrap gap-2'>

                        <img src={data.evidenceCID} alt="Disaster img" className='h-[120px] w-[20%] max-sm:h-[110px] max-sm:w-[50%]  max-sm:mx-auto rounded-md max-sm:order-2' />
                        <Divider orientation='vertical' className='mx-2 h-30 max-sm:hidden' />
                        <div className='max-sm:order-3 flex max-sm:mx-2 items-start flex-col w-full '>
                          <p>Lat & Lon:- <span className='hover:underline hover:text-green-700 cursor-pointer' onClick={(e) => { e.stopPropagation(); handleSelect(data.latitude, data.longitude) }}>{Number(data.latitude).toFixed(2)},{Number(data.longitude).toFixed(2)}</span></p>
                          <p>Disaster:- <span className='text-red-500'>{data.disasterType?.toUpperCase()}</span></p>
                          <p>Request For:- {data.needType?.toUpperCase()}</p>
                          <p>Risk Level:- {data.riskLevel}</p>
                        </div>

                        <div className='flex sm:gap-4 max-sm:gap-1 items-center justify-between flex-col md:px-1'>
                          <div className='flex sm:gap-2 max-sm:gap-1 items-center justify-between md:flex-col'>
                            <div className='flex sm:gap-5 max-sm:gap-2 items-center justify-between p-1'>
                              {!data.isFunds && data.fulfilled && <Chip color='success' variant='flat'>Delivered</Chip>}
                              {!data.isFunds && !data.fulfilled && <Chip color='warning' variant='flat'>Failed</Chip>}
                            </div>
                            <div className='flex sm:gap-5 max-sm:gap-2 items-center justify-between p-1'>
                              {!data.isFunds && data.fulfilled && data.userId === userId && feedback && <Button color='success' size='sm' variant='flat' onClick={() => handleFeedBack(data.disasterType, data.deliveredId)}>FeedBack</Button>}
                            </div>
                          </div>
                          {data.needType == "funds" && <>
                            <div className='flex items-center gap-2 justify-between sm:hidden'>
                              <FaIndianRupeeSign />:{data.fiatRecordedPaise}
                              <FaEthereum />: {formatEther(data.cryptoEscrowWei)}
                            </div>
                            <div className='flex gap-5 items-center justify-between max-sm:hidden'>
                              <FaIndianRupeeSign />:{data.fiatRecordedPaise}
                            </div>
                            <div className='flex gap-5 items-center justify-between max-sm:hidden'>
                              <FaEthereum />:{formatEther(data.cryptoEscrowWei)}
                            </div>
                          </>
                          }
                        </div>
                      </div>
                    </div>
                  </div></>}</div>
              ))}
              <Divider className='my-4' />
            </div>
          </div>
          <div className='max-sm:hidden sticky top-0 h-screen flex flex-col items-center justify-evenly max-2xl:w-[28%] w-[28%]'>
            <div className='absolute inset-0 -z-10000 bg-transparent blur-[4px]'>
              <div className='absolute h-[10%] max-md:h-[10%]  md:w-[80%] max-md:w-[90%] max-sm:w-[68%]  blur-[2px] bg-white rounded-tl-full bottom-0 right-0 '></div>
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
                className='md:h-60 md:w-48 lg:h-72 lg:w-56 xl:h-80 xl:w-64 rounded-2xl'
              />
            </div>

            <div className='w-full flex items-center justify-evenly'>
              <Button
                size='md'
                variant='flat'
                color={active === "personal" ? "secondary" : "success"}
                radius='sm'
                onClick={handlePersonal}
                className='mt-1 mr-1 xl:text-2xl font-serif font-medium'
              >
                Your Req
              </Button>
              <Button
                size='md'
                variant='flat'
                color={active === "other" ? "secondary" : "success"}
                radius='sm'
                onClick={handleOther}
                className='mt-1 ml-1 xl:text-2xl font-serif font-medium'
              >
                Other Req
              </Button>
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
          <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />
          <DeliveredDetailModal isOpen={openDetailModal} onOpenChange={changeDetailModal} requestType={requestType} refreshData={setRefresh} donationData={donatedData} allHelper={resourceData} />
          <Feedback isOpen={openFeedBackModal} onOpenChange={changeFeedBackModal} requestType={requestType} setData={setRefresh} />
        </>
      ) : (<><NoData /></>)}
    </>
  )
}

export default DeliveredTable