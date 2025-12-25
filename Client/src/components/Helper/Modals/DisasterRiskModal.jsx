import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Chip,
} from "@heroui/react";
import Map from '../../Common_Features/Map'
import { DisasterCardView, DisasterDeliveredView, DisasterPersonalView, HelpCardView } from '../../DisasterRiskOverview';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './Finance/PaymentModal'
import { donateGoods, donatorHelper, verifyDelivery } from '../../../ConnectContract/Web3Connection';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { createQrCode, predictedData } from '../../../store/slices/disasterSlice';
import { formatEther } from 'viem';
import { FaEthereum, FaIndianRupeeSign } from 'react-icons/fa6';
import { BiSolidDonateBlood } from "react-icons/bi";
import { ScanQr } from '../../Common_Features/ScanQr';
import { fetchAgent, fetchNGO, toggleAgent, toggleNGO } from '../../../store/slices/authSlice';
import { notifyRequester } from '../../../store/slices/userSlice';



export function HighAlertDisaster({ isOpen, onOpenChange }) {
    const [disasterData, setDisasterData] = useState([])
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        const disasterData = async () => {
            const report = await dispatch(predictedData({ req: 'check' }))
            setDisasterData(report.data.data);
        }
        disasterData();
    }, [])

    return (
        <>
            <Modal size='4xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex  gap-1">Alert</ModalHeader>
                            <ModalBody className='flex  h-full w-full'>
                                <div className='flex gap-4'>
                                    <DisasterCardView data={disasterData} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="success" variant='flat' onClick={() => { navigate('events') }}>
                                    more...
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export function HighAlertHelpRequest({ isOpen, onOpenChange, alertRequest }) {

    const navigate = useNavigate()
    return (
        <>
            <Modal size='4xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex  gap-1">Alert</ModalHeader>
                            <ModalBody className='flex  h-full w-full'>
                                <div className='flex gap-4'>
                                    <HelpCardView data={alertRequest} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="success" variant='flat' onClick={() => { navigate('helpRequest') }}>
                                    more...
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )

}

export function PersonalRequest({ isOpen, onOpenChange, personalRequest }) {
    return (
        <>
            <Modal size='4xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex  gap-1">Recent Request</ModalHeader>
                            <ModalBody className='flex  h-full w-full'>
                                <div className='flex gap-4'>
                                    <DisasterPersonalView data={personalRequest} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export function FeedbackRequest({ isOpen, onOpenChange, feedbackRequest }) {
    return (
        <>
            <Modal size='4xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex  gap-1">Feedback</ModalHeader>
                            <ModalBody className='flex  h-full w-full'>
                                <div className='flex gap-4'>
                                    <DisasterDeliveredView user={feedbackRequest} />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export function EventDetailModal({ isOpen, onOpenChange, detail }) {
    const [coords, setCoords] = useState(null)
    const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();

    const handleMap = (a, b) => {
        const data = {
            lat: a,
            lng: b
        }
        setCoords(data)
        mapModalTrigger();
    }

    const ts = detail?.timestamp;
    let finalTime = "AI Reported";
    if (ts !== undefined && ts !== null && ts !== "") {
        const date = new Date(Number(ts) * 1000);

        const options = {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        };

        const parts = new Intl.DateTimeFormat("en-IN", options).formatToParts(date);

        let day = parts.find(p => p.type === "day").value;
        let month = parts.find(p => p.type === "month").value;
        let year = parts.find(p => p.type === "year").value;
        let hour = parts.find(p => p.type === "hour").value;
        let minute = parts.find(p => p.type === "minute").value;
        let dayPeriod = parts.find(p => p.type === "dayPeriod").value.toUpperCase(); // AM/PM

        finalTime = `${day} ${month} ${year} (${hour}:${minute} ${dayPeriod})`;

    }


    return (
        <>

            <Modal size='3xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>

                <ModalContent >

                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Task Detail</ModalHeader>
                            <ModalBody >
                                <div className='flex items-center justify-center flex-col h-full w-full gap-2'>
                                    <div className='h-52 w-52 border-4 border-green-200 flex items-center justify-center rounded-xl'>
                                        <img src={detail?.ipfsUrl} alt="Affected area" className='rounded-xl h-full w-full' />
                                    </div>
                                    <div className='text-xl max-md:text-lg max-sm:text-md font-medium' onClick={(e) => { e.stopPropagation(); handleMap(detail?.latitude, detail?.longitude) }}>
                                        Location: <span className='text-green-400 cursor-pointer hover:underline hover:text-green-800'>{Number(detail?.latitude).toFixed(2)},{Number(detail?.longitude).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between max-md:flex-col w-full p-1 max-md:gap-5'>
                                    <div className='flex items-start justify-center flex-col gap-1 text-xl max-md:text-lg max-sm:text-sm font-medium md:mx-10 max-md:mx-5'>
                                        <div >• Disaster: <span className='text-orange-500'>{detail?.disasterType?.toUpperCase()}</span></div>
                                        <div>• Reporter: {detail?.name || "AI"}</div>
                                        <div>• Risk Level: <span className='text-blue-500'>{detail?.riskLevel}</span></div>
                                        <div>• Severity: <span className='text-red-500'>{detail?.severity?.toUpperCase()}</span></div>
                                        <div>• Reported On: <span className='text-yellow-700'>{finalTime}</span></div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />

        </>
    )
}

export function MapModal({ isOpen, onOpenChange, coordinates }) {


    return (
        <>

            <Modal size='4xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Live Location</ModalHeader>
                            <ModalBody >
                                <Map onGet={coordinates} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export function TaskDetailModal({ isOpen, onOpenChange, requestType, refreshData, allHelper }) {

    const [coords, setCoords] = useState(null)
    const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();
    const { address } = useAccount();
    const dispatch = useDispatch();
    const { role, _id: userId, helpRequestLimit } = useSelector((state) => state.user);


    const handleVerify = async (requestId) => {
        const num = BigInt(requestId);
        const verification = await verifyDelivery([num], address);
        if (verification) {
            if (role === "ngo") {
                await dispatch(toggleNGO())
            } else if (role === "gov_Agent") {
                await dispatch(toggleAgent())
            }
            toast.success("Delivery Verified Successfully");
            refreshData((prev) => !prev);
            const notifyData = {
                userId: requestType.userId,
                title: 'ReliefSync - Delivery Verified',
                message: `Your Delivery for ${requestType.needType} has been verified by ${role.toUpperCase()} please share your feedback on delivered feedback section.`,
                allocatedBy: requestType.allocaterName
            }
            setTimeout(async()=>{
            await dispatch(notifyRequester(notifyData))
            }, 300)
        } else {
            toast.error("Verification Failed");
        }
    };

    const handleHelp = async (requestId, id) => {
        try {
            let data = {};
            if (role == "ngo") {
                const ngoDetails = await dispatch(fetchNGO());

                data = {
                    organizationName: ngoDetails.ngo_Name,
                    contact: ngoDetails.phone,
                }
            } else if (role == "gov_Agent") {
                const agentDetails = await dispatch(fetchAgent());

                data = {
                    organizationName: agentDetails.name,
                    contact: agentDetails.email,
                }
            }


            const helper = await donatorHelper([requestId, userId, id, role, data.organizationName, data.contact], address);
            if (helper.status == 'success') {
                toast.success(' Successfully Allocated')
                refreshData(prev => !prev);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleMap = (a, b) => {
        const data = {
            lat: a,
            lng: b
        }
        setCoords(data)
        mapModalTrigger();
    }
    return (
        <>
            <Modal size='3xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>

                <ModalContent >

                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Task Detail</ModalHeader>
                            <ModalBody >
                                <div className='flex items-center justify-center flex-col h-full w-full gap-2'>
                                    <div className='h-52 w-52 border-4 border-green-200 flex items-center justify-center rounded-xl'>
                                        <img src={requestType.disasterImg} alt="Affected area" className='rounded-xl h-full w-full' />
                                    </div>
                                    <div className='text-xl max-md:text-lg max-sm:text-md font-medium' onClick={(e) => { e.stopPropagation(); handleMap(requestType.latitude, requestType.longitude) }}>
                                        Location: <span className='text-green-400 cursor-pointer hover:underline hover:text-green-800'>{Number(requestType.latitude).toFixed(2)},{Number(requestType.longitude).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between max-md:flex-col w-full p-1 max-md:gap-5'>
                                    <div className='flex items-start justify-center flex-col gap-1 text-xl max-md:text-lg max-sm:text-sm font-medium md:mx-10 max-md:mx-5'>
                                        <div >• Donation For: <span className='text-red-500'>{requestType.donationType.toUpperCase()}</span></div>
                                        <div>• People Count: {requestType.survivorCount}</div>
                                        <div>• Delivered: {requestType.delivered ?
                                            (
                                                <Chip color='success' variant='flat'>Yes</Chip>) : (<Chip color='danger' variant='flat'>NO</Chip>)}</div>

                                        <div>• Donor Role: <span className='text-green-500'>{requestType.donorRole.toUpperCase()}</span></div>
                                        <div>• Allocation Date: {new Date(Number(requestType.timestamp) * 1000).toISOString().split("T")[0]}</div>
                                        <div>• End Date: {new Date(Number(requestType.validUntil) * 1000).toISOString().split("T")[0]}</div>

                                    </div>
                                    <div >
                                        {(requestType.donorRole === "ngo" || requestType.donorRole === "gov_Agent") &&
                                            (requestType.userId === userId ||
                                                requestType.helpers?.includes(userId)) && (
                                                <ScanQr DecodedId={(id) => handleVerify(id)} />
                                            )}
                                    </div>
                                </div>
                                <div>
                                    {requestType.needType !== "funds" && allHelper?.length > 0 && (<><div className='text-2xl font-bold font-serif flex w-full items-center justify-center'>• Helpers:</div>

                                        {allHelper.length > 0 && allHelper.map((helper, index) => (<div key={index} className='flex item-start justify-between gap-10 w-full text-xl max-md:text-lg max-sm:text-sm font-normal md:px-10 max-md:px-5'>
                                            <div className='flex flex-col items-start justify-center'>

                                                <span className='inline-flex gap-1 font-medium'>{index + 1}
                                                    <div> {helper.role === 'gov_Agent' ? 'Name' : 'Organzation'}: {helper.organizationName}</div></span>
                                                {(role === "admin" || role === "ngo" || role === "gov_Agent") && <div>• Contact: <a href={`tel:${helper.contact}`}><span className='hover:text-green-500 hover:text-2xl hover:font-semibold hover:transition-all'>{helper.contact}</span></a></div>}
                                            </div>
                                            <div>• Role: {(helper.role).toUpperCase()}</div>
                                            <div>{(helper?.scanned ? (<h1 className="text-xl font-medium text-black font-serif"><Chip size="lg"
                                                color="success"
                                                variant="dot" >Inactive</Chip></h1>) : (
                                                <h1 className="text-xl font-medium text-black font-serif"><Chip size="lg"
                                                    color="danger"
                                                    variant="dot" >Active</Chip></h1>
                                            ))}</div>
                                        </div>
                                        ))}
                                    </>)}

                                </div>
                                <div className="flex justify-end w-full text-2xl font-serif font-medium">
                                    Survivor:- <span className="font-normal ml-1">{requestType.requesterName}</span>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {(requestType.donorRole == "ngo" || requestType.donorRole == "gov_Agent") && (requestType.donor != address && !requestType.helpers?.includes(userId)) && requestType.helpRequired && helpRequestLimit > 0 && requestType.userId !== userId && <Button color="success" variant="flat" onClick={() => handleHelp(requestType.requestId, requestType.id, requestType.userId)} onPress={onClose}>
                                    Help
                                </Button>}
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />
        </>

    )
}
export function DeliveredDetailModal({ isOpen, onOpenChange, requestType, donationData, allHelper }) {
    const [coords, setCoords] = useState(null)

    const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();
    const { role } = useSelector((state) => state.user);
    const handleMap = (a, b) => {
        const data = {
            lat: a,
            lng: b
        }
        setCoords(data)
        mapModalTrigger();
    }
    const donated = [];
    const filteredData = donationData.filter((donation) => donation.requestId == requestType?.id);
    donated.push(...filteredData);
    return (
        <>
            <Modal size='3xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Delivered Detail</ModalHeader>
                            <ModalBody >
                                <div className='flex items-center justify-center flex-col h-full w-full gap-2'>
                                    <div className='h-52 w-52 border-4 border-green-200 flex items-center justify-center rounded-xl'>
                                        <img src={requestType.evidenceCID} alt="Affected area" className='rounded-xl h-full w-full' />
                                    </div>
                                    <div className='text-xl max-md:text-lg max-sm:text-md font-medium ' onClick={(e) => { e.stopPropagation(); handleMap(requestType.latitude, requestType.longitude) }}>
                                        Location: <span className='text-green-400 cursor-pointer hover:underline hover:text-green-800'>{Number(requestType.latitude).toFixed(2)},{Number(requestType.longitude).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-around max-md:flex-col w-full p-1 max-sm:gap-8'>
                                    <div className='flex items-start justify-center flex-col gap-1 text-xl max-md:text-lg max-sm:text-sm font-medium md:mx-10 max-md:mx-5'>
                                        <div >• Request For: <span className='text-red-500'>{requestType.needType.toUpperCase()}</span></div>
                                        <div>• People Count: {requestType.survivorCount}</div>
                                        <div>• Fulfilled: {requestType.needType == "funds" && requestType.active &&
                                            <Chip color='warning' variant='flat'>Partial</Chip >}{requestType.needType != "funds" && !requestType.active && <Chip color='success' variant='flat'>Yes</Chip>}{requestType.needType != "funds" && !requestType.fulfilled && <Chip color='danger' variant='flat'>NO</Chip>}{requestType.needType == "funds" && !requestType.active && <Chip color='success' variant='flat'>YES</Chip>}</div>
                                        <div>• Active: {requestType.active ? <Chip color='success' variant='flat'>YES</Chip> : <Chip color='danger' variant='flat'>NO</Chip>}</div>
                                        <div>• Disaster Type: {requestType.disasterType.toUpperCase()}</div>
                                        <div>• RiskLevel: {requestType.riskLevel >= 2 ? <span className='text-red-500'>{requestType.riskLevel}</span> : requestType.riskLevel}</div>
                                        <div>• Severity: {requestType.severity == "High" ? <span className='text-red-500'>{requestType.severity}</span> : requestType.severity}</div>
                                        {(role === "admin" || role === "ngo" || role === "gov_Agent") && <div>• Phone.NO: {requestType.phone}</div>}
                                        <div>• Description: {requestType.description}</div>
                                    </div>
                                    <div className='relative flex items-center justify-center flex-col gap-10'>
                                        {requestType.needType == 'funds' &&
                                            <>

                                                <div className='flex gap-2 items-center justify-between '>
                                                    <div className='absolute flex justify-center h-full w-full'><Chip color='success' variant='flat'>Collection</Chip></div>
                                                    <FaIndianRupeeSign size={20} />: {requestType.fiatRecordedPaise}
                                                    <FaEthereum size={20} />: {formatEther(requestType.cryptoEscrowWei)}
                                                </div>
                                                <div className='flex gap-2 items-center justify-between'>
                                                    <div className='absolute flex justify-center h-full w-full'><Chip color='success' variant='flat'>Donated</Chip></div>
                                                    <BiSolidDonateBlood size={20} color='green' />: {formatEther(donated[0]?.amountPaise) || 0}
                                                    <BiSolidDonateBlood size={20} color='green' />: {formatEther(donated[0]?.amountWei || 0) || 0}
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div>
                                    {requestType.needType !== "funds" && allHelper.length > 0 && (<><div className='text-2xl font-bold font-serif flex w-full items-center justify-center'>• Helpers:</div>

                                        {allHelper.length > 0 && allHelper.map((helper, index) => (<div key={index} className='flex item-start justify-between gap-10 w-full text-xl max-md:text-lg max-sm:text-sm font-normal md:px-10 max-md:px-5'>
                                            <div className='flex flex-col items-start justify-center'>

                                                <span className='inline-flex gap-1 font-medium'>{index + 1}
                                                    <div> {helper.role === 'gov_Agent' ? 'Name' : 'Organzation'}: {helper.organizationName}</div></span>
                                                {(role === "admin" || role === "ngo" || role === "gov_Agent") && <div>• Contact: <a href={`tel:${helper.contact}`}><span className='hover:text-green-500 hover:text-2xl hover:font-semibold hover:transition-all'>{helper.contact}</span></a></div>}
                                            </div>
                                            <div>• Role: {(helper.role).toUpperCase()}</div>
                                        </div>
                                        ))}
                                    </>)}
                                </div>
                                <div className="flex justify-end w-full text-2xl font-serif font-medium">
                                    By:- <span className="font-normal ml-1">{requestType.allocaterName}</span>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />
        </>
    )
}

export function HelpDetailModal({ isOpen, onOpenChange, requestType, refreshData, donationData, allHelper }) {
    const { address } = useAccount();
    const wallet = address;
    const [coords, setCoords] = useState(null)
    const dispatch = useDispatch();
    const { _id: userId, help, role, helpRequestLimit } = useSelector((state) => state.user);
    //const [requestData, setRequestData] = useState([])
    const { isOpen: paymentModal, onOpen: paymentModalOpen, onOpenChange: paymentModalChange } = useDisclosure();
    const { isOpen: openMapModal, onOpen: mapModalTrigger, onOpenChange: changeMapModal } = useDisclosure();
    const handlePayment = async () => {

        paymentModalOpen();
    }

    const handleMap = (a, b) => {
        const data = {
            lat: a,
            lng: b
        }
        setCoords(data)
        mapModalTrigger();
    }

    const handleAllocate = async () => {
        try {
            let data = {};
            if (role == "ngo") {
                const ngoDetails = await dispatch(fetchNGO());

                data = {
                    organizationName: ngoDetails.ngo_Name,
                }
            } else if (role == "gov_Agent") {
                const agentDetails = await dispatch(fetchAgent());

                data = {
                    organizationName: agentDetails.name,
                }
            }

            const goodsData = await donateGoods([requestType.requestId, data.organizationName, requestType.role, requestType.donationType, wallet, help, userId], address)

            if (goodsData.status == 'success') {
                if (role === "ngo") {
                    await dispatch(toggleNGO())
                } else if (role === "gov_Agent") {
                    await dispatch(toggleAgent())
                }
                toast.success(' Successfully Allocated')
            } else {
                toast.error('Complete your pending task')
                return;
            }
            await dispatch(createQrCode({ id: Number(requestType.id), userId: requestType.userId }))
            refreshData(prev => !prev)
            const notifyData = {
                userId: requestType.userId,
                title: 'ReliefSync - Help Allocated',
                message: `Your Help Request for ${requestType.needType} has been allocated by ${role.toUpperCase()}`,
                allocatedBy: data.organizationName
            }
            setTimeout(async()=>{
            await dispatch(notifyRequester(notifyData))
            }, 300)
        } catch (error) {
            toast.error("Complete your pending task");
            console.log(error?.shortMessage);
        }
    }
    const donated = [];
    const filteredData = donationData.filter((donation) => donation?.requestId == requestType?.id);
    donated.push(...filteredData);
    return (
        <>

            <Modal size='3xl' radius='sm' backdrop='blur' scrollBehavior='inside' placement='center' isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Help Detail</ModalHeader>
                            <ModalBody >



                                <div className='flex items-center justify-center flex-col h-full w-full gap-2'>
                                    <div className='h-52 w-52 border-4 border-green-200 flex items-center justify-center rounded-xl'>
                                        <img src={requestType.evidenceCID} alt="Affected area" className='rounded-xl h-full w-full' />
                                    </div>
                                    <div className='text-xl max-md:text-lg max-sm:text-md font-medium ' onClick={(e) => { e.stopPropagation(); handleMap(requestType.latitude, requestType.longitude) }}>
                                        Location: <span className='text-green-400 cursor-pointer hover:underline hover:text-green-800'>{Number(requestType.latitude).toFixed(2)},{Number(requestType.longitude).toFixed(2)}</span>
                                    </div>

                                </div>
                                <div className='flex items-center justify-between max-md:flex-col w-full p-1 '>


                                    <div className='flex items-start justify-center flex-col gap-1 text-xl max-md:text-lg max-sm:text-sm font-medium md:mx-10 max-md:mx-5'>

                                        <div >• Request For: <span className='text-red-500'>{requestType.needType.toUpperCase()}</span></div>
                                        <div>• People Count: {requestType.survivorCount}</div>
                                        <div>• Fulfilled: {requestType.needType == "funds" && requestType.active &&
                                            <Chip color='warning' variant='flat'>Partial</Chip >}{requestType.needType != "funds" && !requestType.active && <Chip color='success' variant='flat'>Yes</Chip>}{requestType.needType != "funds" && !requestType.fulfilled && <Chip color='danger' variant='flat'>NO</Chip>}{requestType.needType !== "funds" && requestType.fulfilled && <Chip color='success' variant='flat'>YES</Chip>}</div>
                                        <div>• Active: {requestType.active ? <Chip color='success' variant='flat'>YES</Chip> : <Chip color='success' variant='flat'>NO</Chip>}</div>
                                        <div>• Disaster Type: {requestType.disasterType.toUpperCase()}</div>
                                        <div>• RiskLevel: {requestType.riskLevel >= 2 ? <span className='text-red-500'>{requestType.riskLevel}</span> : requestType.riskLevel}</div>
                                        <div>• Severity: {requestType.severity == "High" ? <span className='text-red-500'>{requestType.severity}</span> : requestType.severity}</div>
                                        {(role === "admin" || role === "ngo" || role === "gov_Agent") && <div>• Phone.NO: {requestType.phone}</div>}
                                        <div>• Description: {requestType.description}</div>

                                    </div>
                                    <div className='relative flex items-center justify-center flex-col gap-10'>
                                        {requestType.needType == 'funds' &&
                                            <>

                                                {donated[0]?.userId === userId && <><div className='flex gap-2 items-center justify-between '>
                                                    <div className='absolute flex justify-center h-full w-full'><Chip color='success' variant='flat'>Collection</Chip></div>
                                                    <FaIndianRupeeSign size={20} />: {requestType.fiatRecordedPaise}
                                                    <FaEthereum size={20} />: {formatEther(requestType.cryptoEscrowWei)}
                                                </div>
                                                    <div className='flex gap-2 items-center justify-between'>
                                                        <div className='absolute flex justify-center h-full w-full'><Chip color='success' variant='flat'>Donated</Chip></div>
                                                        <BiSolidDonateBlood size={20} color='green' />: {donated[0]?.amountPaise || 0}
                                                        <BiSolidDonateBlood size={20} color='green' />: {formatEther(donated[0]?.amountWei || 0) || 0}
                                                    </div></>}
                                            </>
                                        }
                                    </div>
                                    <div>

                                        {requestType.allocated && requestType.userId === userId && <img src={requestType?.qrImage} alt="QR Code" className="w-40 h-40"
                                        />}
                                    </div>
                                </div>
                                <div>
                                    {requestType.needType !== "funds" && allHelper.length > 0 && (<><div className='text-2xl font-bold font-serif flex w-full items-center justify-center'>• Helpers:</div>

                                        {allHelper.length > 0 && allHelper.map((helper, index) => (<div key={index} className='flex item-start justify-between gap-10 w-full text-xl max-md:text-lg max-sm:text-sm font-normal md:px-10 max-md:px-5'>
                                            <div className='flex flex-col items-start justify-center'>

                                                <span className='inline-flex gap-1 font-medium'>{index + 1}
                                                    <div> {helper.role === 'gov_Agent' ? 'Name' : 'Organzation'}: {helper.organizationName}</div></span>
                                                {(role === "admin" || role === "ngo" || role === "gov_Agent") && <div>• Contact: <a href={`tel:${helper.contact}`}><span className='hover:text-green-500 hover:text-2xl hover:font-semibold hover:transition-all'>{helper.contact}</span></a></div>}
                                            </div>
                                            <div>• Role: {(helper.role).toUpperCase()}</div>
                                        </div>
                                        ))}
                                    </>)}
                                </div>
                                {requestType.allocated && <div className="flex justify-end w-full text-2xl font-serif font-medium">
                                    By:- <span className="font-normal ml-1">{requestType.allocaterName}</span>
                                </div>}
                            </ModalBody>
                            <ModalFooter>
                                {(requestType.role == "ngo" || requestType.role == "gov_Agent") && !requestType.fulfilled && !requestType.allocated && requestType.userId !== userId && helpRequestLimit > 0 && <Button color="success" variant="flat" onPress={onClose} onClick={handleAllocate}>
                                    Allocate
                                </Button>}
                                {requestType.donationType === "funds" && requestType.active && requestType.userId !== userId && <Button color="success" variant="flat" onPress={onClose} onClick={handlePayment} >
                                    Donate
                                </Button>}
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                {/* <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <MapModal isOpen={openMapModal} onOpenChange={changeMapModal} coordinates={coords} />

            <PaymentModal isOpen={paymentModal} onOpenChange={paymentModalChange} donateData={requestType} resetData={refreshData} />
        </>
    )
}

