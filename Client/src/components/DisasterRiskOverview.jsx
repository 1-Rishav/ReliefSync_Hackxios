import React, { useEffect, useState } from "react";
import { Meteors } from "./ui/BoxEffect";
import { Button, Chip, Divider, useDisclosure } from "@heroui/react";
import { DeliveredDetailModal, HelpDetailModal, MapModal } from "./Helper/Modals/DisasterRiskModal";
import { formatEther } from "viem";
import { FaEthereum, FaIndianRupeeSign } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getQrCode } from "../store/slices/disasterSlice";
import { getAllDonation, getAllHelper, getProcessedRequests } from "../ConnectContract/Web3Connection";
import NoData from "./Common_Features/NoData";
import Feedback from "./Helper/Modals/FeedbackModel";




export function HelpCardView({ data }) {
  const [coords, setCoords] = useState(null)
  const [donatedData, setDonatedData] = useState([])
  const [resourceData, setResourceData] = useState([])
  const [requestType, setRequestType] = useState(null)
  const [refresh, setRefresh] = useState(false);

  const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();
  const { isOpen: openDetailModal, onOpen: detailModalTrigger, onOpenChange: changeDetailModal } = useDisclosure();
  const handleLocation = async (latitude, longitude) => {
    const data = {
      lat: latitude,
      lng: longitude
    }
    setCoords(data)
    mapModalTrigger();
  }
  const dispatch = useDispatch();
  const { role,_id:userId } = useSelector((state) => state.user);

  useEffect(() => {
  
      const getData = async () => {
        const undelivered = await getProcessedRequests();
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


  return (
    <>
      {data.length > 0 ? (<>
        {data?.map((data, idx) => (
          <div key={idx} onClick={() => handleDetail({ ...data })} className="relative w-full flex items-center justify-center cursor-pointer">
            {/* Gradient blur background */}
            <div className="absolute inset-0 h-full w-full scale-[0.70] transform rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl " />

            {/* Fixed size container */}
            <div
              className="relative h-[270px] w-fit rounded-2xl border border-gray-300 bg-gray-100 px-4 py-5 shadow-xl flex items-center justify-center flex-col"
            >
                                    <div className='h-20 w-20 border-4 border-green-200 flex items-center justify-center rounded-xl'>
                                        <img src={data.evidenceCID} alt="Affected area" className='rounded-xl h-full w-full' />
                                    </div>
                                
              {/* Scrollable content box */}
              <div className="flex-1 overflow-y-auto pr-2">
                <h1 className="text-2xl font-semibold text-black">Lat & Lon:- <span className='hover:underline hover:text-green-700 cursor-pointer' onClick={(e) => { e.stopPropagation(); handleLocation(data.latitude, data.longitude) }}>{Number(data.latitude).toFixed(2)} , {Number(data.longitude).toFixed(2)}</span></h1>
                <h1 className="text-2xl font-semibold text-black">Disaster Type:{data.disasterType} </h1>
                <h1 className="text-2xl font-semibold text-black">Risk Level: {data.riskLevel}</h1>
                <h1 className="text-2xl font-semibold text-black">Severity: {data.severity}</h1>
              </div>

              {/* Meteor effect always pinned */}
              <Meteors number={5} />
            </div>
          </div>
        ))}
      </>) : (<div className="w-full"><NoData /></div>)}
      <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />
      <HelpDetailModal isOpen={openDetailModal} onOpenChange={changeDetailModal} requestType={requestType} refreshData={setRefresh} donationData={donatedData} allHelper={resourceData} />
      
    </>
  );
}
export function DisasterCardView({ data }) {
  const [coords, setCoords] = useState(null)

  const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();
  const handleLocation = async (latitude, longitude) => {
    const data = {
      lat: latitude,
      lng: longitude
    }
    setCoords(data)
    mapModalTrigger();
  }

  return (
    <>
      {data.length > 0 ? (<>
        {data?.map((data, idx) => (
          <div key={idx} className="relative w-full flex items-center justify-center cursor-pointer">
            {/* Gradient blur background */}
            <div className="absolute inset-0 h-full w-full scale-[0.70] transform rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl " />

            {/* Fixed size container */}
            <div
              className="relative h-[270px] w-fit rounded-2xl border border-gray-300 bg-gray-100 px-4 py-5 shadow-xl flex items-center justify-center flex-col"
            >
              {/* Scrollable content box */}
              <div className="flex-1 overflow-y-auto pr-2">
                <h1 className="text-2xl font-semibold text-black">Lat & Lon:- <span className='hover:underline hover:text-green-700 cursor-pointer' onClick={(e) => { e.stopPropagation(); handleLocation(data.latitude, data.longitude) }}>{Number(data.latitude).toFixed(2)} , {Number(data.longitude).toFixed(2)}</span></h1>
                <h1 className="text-2xl font-semibold text-black">Disaster Type:{data.disasterType} </h1>
                <h1 className="text-2xl font-semibold text-black">Risk Level: {data.riskLevel}</h1>
                <h1 className="text-2xl font-semibold text-black">Severity: {data.severity}</h1>
              </div>

              {/* Meteor effect always pinned */}
              <Meteors number={5} />
            </div>
          </div>
        ))}
      </>) : (<div className="w-full"><NoData /></div>)}
      <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />      
    </>
  );
}

export function DisasterPersonalView({ data }) {

  const [donatedData, setDonatedData] = useState([])
  const [resourceData, setResourceData] = useState([])
  const [requestType, setRequestType] = useState(null)
  const [coords, setCoords] = useState(null)

  const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();
  const { isOpen: openDetailModal, onOpen: detailModalTrigger, onOpenChange: changeDetailModal } = useDisclosure();
  const dispatch = useDispatch();
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

  return (
    <>
      {data.length > 0 ? (<>
        {data?.map((data, idx) => (
          <div key={idx} onClick={() => handleDetail({ ...data })} className='border-5 p-1 my-2 rounded-md relative h-full w-full flex flex-col cursor-pointer hover:scale-105 transition-transform'>
            <div className='relative h-full w-full max-sm:flex-col flex max-sm:items-center items-start justify-evenly max-sm:flex-wrap gap-2'>

              <img src={data.evidenceCID} alt="Disaster img" className='h-[120px] w-[20%] max-sm:h-[110px] max-sm:w-[50%] max-sm:mx-auto rounded-md max-sm:order-2' />

              <Divider orientation='vertical' className='mx-2 h-30 max-sm:hidden' />

              <div className='max-sm:order-3 flex items-start flex-col w-full'>
                <p >Lat & Lon:- <span className='hover:underline hover:text-green-700 cursor-pointer' onClick={(e) => { e.stopPropagation(); handleLocation(data.latitude, data.longitude) }}>{Number(data.latitude).toFixed(2)},{Number(data.longitude).toFixed(2)}</span></p>
                <p>Disaster:- {data.disasterType?.toUpperCase()}</p>
                <p>Request For:- {data.needType?.toUpperCase()}</p>
                <p>RiskLevel:- {data.riskLevel}</p>
              </div>

              <div className='flex sm:gap-4 max-sm:gap-1 items-center justify-between flex-col md:px-5'>
                <div className='flex sm:gap-5 max-sm:gap-2 items-center justify-between'>
                  {!data.fulfilled && (<Chip color='danger' variant='faded'>Pending</Chip>)}

                  {!data.isFunds && data.fulfilled && <Chip color='success' variant='flat'>Delivered</Chip>}

                  {data?.allocated && <Chip color='warning' variant='flat'>Allocated</Chip>}

                </div>

                {data.needType == "funds" && <>
                  <div className='flex items-center gap-2 w-full justify-between sm:hidden'>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='inline-flex items-center cursor-pointer  gap-2'>
                        <FaIndianRupeeSign />:{data.fiatRecordedPaise}</span>
                    </div>
                    <div className='flex w-full items-center justify-between gap-2'>
                      <span className='inline-flex items-center cursor-pointer  gap-2'><FaEthereum />: {formatEther(data.cryptoEscrowWei)}</span>
                    </div>
                  </div>
                  <div className='flex gap-5 items-center justify-between max-sm:hidden'>
                    <span className='inline-flex items-center cursor-pointer  gap-2'><FaIndianRupeeSign />:{data.fiatRecordedPaise}</span>
                  </div>
                  <div className='flex gap-5 items-center justify-between max-sm:hidden'>
                    <span className='inline-flex items-center cursor-pointer  gap-2'>
                      <FaEthereum />:{formatEther(data.cryptoEscrowWei)}</span>
                  </div>
                </>
                }
              </div>
            </div>
          </div>
        ))}
      </>) : (<div className="w-full"><NoData /></div>)}

      <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />
      <HelpDetailModal isOpen={openDetailModal} onOpenChange={changeDetailModal} requestType={requestType} donationData={donatedData} allHelper={resourceData} />
    </>
  )
}

export function DisasterDeliveredView({ user }) {

  const [requestType, setRequestType] = useState(null)
  const [donatedData, setDonatedData] = useState([])
  const [resourceData, setResourceData] = useState([]);

  const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();
  const { isOpen: openDetailModal, onOpen: detailModalTrigger, onOpenChange: changeDetailModal } = useDisclosure();
  const { isOpen: openFeedBackModal, onOpen: feedBackModalTrigger, onOpenChange: changeFeedBackModal } = useDisclosure();
  const [coords, setCoords] = useState(null)

  const { role, _id: userId, feedback } = useSelector((state) => state.user);

  const handleSelect = (a, b) => {
    //const [lat, lng] = s.split(",").map(item => item.trim());

    const data = {
      lat: a,
      lng: b
    }
    setCoords(data)
    mapModalTrigger();
  }

  const handleDetail = async (allData) => {
    const data = {
      donationType: allData.needType,
      requestId: allData.id,
      role,
      ...allData,

    }
    setRequestType(data);
    const filteredData = user.filter((donation) => donation.userId === userId && donation.donationType == 'funds')
    setDonatedData(filteredData)
    const filteredResourceData = user.filter((donation) => donation.requestId === allData.id && Math.floor(Date.now() / 1000) < Number(donation.validUntil));
    const helpers = await getAllHelper();
    for (let i = 0; i < filteredResourceData.length; i++) {
      const filteredHelpers = helpers.filter((helper) => helper.donationId == filteredResourceData[i]?.id);
      setResourceData(filteredHelpers)
    }
    detailModalTrigger();
  }

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
      {user.length > 0 ? (<>
        {user?.map((data, idx) => (
          <div key={idx} onClick={() => handleDetail({ ...data })} className='cursor-pointer border-5 px-1 my-2 rounded-md relative h-full w-full flex flex-col'>
            <div className='relative h-full w-full max-sm:flex-col flex max-sm:items-center items-start justify-evenly max-sm:flex-wrap gap-2'>

              <img src={data.evidenceCID} alt="Disaster img" className='h-[120px] w-[20%] max-sm:h-[110px] max-sm:w-[50%]  max-sm:mx-auto rounded-md max-sm:order-2' />
              <Divider orientation='vertical' className='mx-2 h-30 max-sm:hidden' />
              <div className='max-sm:order-3 flex max-sm:mx-2 items-start flex-col w-full '>
                <p>Lat & Lon:- <span className='hover:underline hover:text-green-700 cursor-pointer' onClick={(e) => { e.stopPropagation(); handleSelect(data.latitude, data.longitude) }}>{Number(data.latitude).toFixed(2)},{Number(data.longitude).toFixed(2)}</span></p>
                <p>Disaster Type:- {data.disasterType?.toUpperCase()}</p>
                <p>Request For:- {data.needType?.toUpperCase()}</p>
                <p>Risk Level:- {data.riskLevel}</p>
              </div>

              <div className='flex sm:gap-4 max-sm:gap-1 items-center justify-between flex-col md:px-5'>
                <div className='flex sm:gap-4 max-sm:gap-1 items-center justify-between md:flex-col'>
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
        ))}
      </>) : (<div className="w-full"><NoData /></div>)}
      <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />
      <DeliveredDetailModal isOpen={openDetailModal} onOpenChange={changeDetailModal} requestType={requestType} donationData={donatedData} allHelper={resourceData} />
      <Feedback isOpen={openFeedBackModal} onOpenChange={changeFeedBackModal} requestType={requestType} />
    </>
  )
}

export function DisasterRisk({ risk, img, onClick }) {

  return (
    <div onClick={onClick} className="md:w-md max-md:w-sm max-sm:w-2xs p-1 cursor-pointer hover:scale-105 transition-transform ">
      <div className="relative w-full ">
        <div
          className="relative flex h-[240px] flex-col items-center justify-center rounded-2xl border border-gray-300 bg-gray-100 px-4 py-2 shadow-xl gap-1">

          <div className="flex items-center justify-around h-full w-full">
            <div className="h-48 w-80 border-2 flex items-center justify-center rounded-lg">
              <div className="h-48 w-80 border-2 bg-gradient-to-r from-blue-900 to-green-500 flex items-center justify-center rounded-lg">
                <img src={img} alt="" className="w-full h-full rounded-lg p-1  blur-[2px]" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center h-full w-full">{risk}</div>

          {/* Meaty part - Meteor effect */}
          <Meteors number={5} />
        </div>
      </div>
    </div>
  );
}

