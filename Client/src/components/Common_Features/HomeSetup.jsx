import React, { useEffect, useRef } from 'react'
import Map from './Map'
import Spline from '@splinetool/react-spline';
import { FaWater, FaFire, FaGlobeAsia, FaLeaf } from 'react-icons/fa';
import { AnimatePresence, motion } from 'motion/react'
import { Divider, useDisclosure } from "@heroui/react";
import { Disaster_DraggableCard } from '../Disaster_DraggableCard';
import { Disaster_small } from '../Disaster_small';
import { getUser } from '../../store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { DisasterRisk } from '../DisasterRiskOverview';
import { FeedbackRequest, HighAlertDisaster, HighAlertHelpRequest, PersonalRequest } from '../Helper/Modals/DisasterRiskModal';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all';
import { getProcessedRequests } from '../../ConnectContract/Web3Connection';
import { useState } from 'react';
import TargetAllocation from './TargetAllocation';
import { fetchAgent, fetchNGO } from '../../store/slices/authSlice';

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

const HomeSetup = () => {
    const [highRiskData, setHighRiskData] = useState([]);
    const [personalInfo, setPersonalInfo] = useState([]);
    const [feedbackInfo, setFeedbackInfo] = useState([]);
    const [emergencyStatus , setEmergencyStatus] = useState(false);
    const imageRef = useRef(null);
    const imageDiv = useRef(null);
    const dispatch = useDispatch();

    const { _id: userId, role } = useSelector((state) => state.user);

    const { isOpen: openDisaster, onOpen: openDisasterTrigger, onOpenChange: changeDisasterModal } = useDisclosure();
    const { isOpen: openHelpRequest, onOpen: openHelpRequestTrigger, onOpenChange: changeHelpRequestModal } = useDisclosure();
    const { isOpen: openPersonal, onOpen: openPersonalTrigger, onOpenChange: changePersonalModal } = useDisclosure();
    const { isOpen: openFeedback, onOpen: openFeedbackTrigger, onOpenChange: changeFeedbackModal } = useDisclosure();



    useEffect(() => {
        const user = async () => {
            await dispatch(getUser());
            if(role === 'ngo'){
                const ngoData = await dispatch(fetchNGO());
                setEmergencyStatus(ngoData.emergency);
            }else if (role === 'gov_Agent'){
                const agentData = await dispatch(fetchAgent());
                setEmergencyStatus(agentData.emergency);
            }

            const undeliveredRequest = await getProcessedRequests();

            let highRisk = [];
            for (let i = 0; i < undeliveredRequest.length; i++) {
                if (undeliveredRequest.length === 0) break;
                let d = undeliveredRequest[i];
                if (
                    ((d.riskLevel == 2 && d.severity === "High") ||
                        (d.riskLevel == 1 && (d.severity === "Low"))) && d.active
                ) {
                    highRisk.push(d);
                }
                if (highRisk.length === 1) {
                    setHighRiskData(highRisk);
                    break;
                }
                if (highRisk.length === 2) {
                    setHighRiskData(highRisk);
                    break;
                }
            }
            const personal = undeliveredRequest.filter((req) => req.userId === userId && req.active);
            setPersonalInfo(personal);
            const feedback = undeliveredRequest.filter((req) => req.userId === userId && !req.active && req.fulfilled);
            setFeedbackInfo(feedback);
        }
        user();
    }, [])

    gsap.registerPlugin(ScrollTrigger);

    useEffect(() => {
        if (imageArray.length > 0) {
            ScrollTrigger.refresh();
        }
    }, [imageArray]);

    useGSAP(() => {
        let lastIndex = -1;
        const yValue = window.innerWidth > 1280 ? 300 : 250;

        gsap.to(imageDiv.current, {
            y: yValue,
            ease: "easeOut",
            scrollTrigger: {
                trigger: imageRef.current,
                start: "top 100%",
                end: "top 0%",
                scrub: true,
                onUpdate: (ele) => {
                    if (imageArray.length === 0) return; // avoid empty
                    let imageIndex =
                        ele.progress < 1
                            ? Math.floor(ele.progress * imageArray.length)
                            : imageArray.length - 1;

                    if (imageIndex !== lastIndex) {
                        imageRef.current.src = imageArray[imageIndex];
                        lastIndex = imageIndex;
                    }
                },
            },
        });
    }, [imageArray]);

    return (
        <>

            <div className=' relative h-full w-full ' >
                <div className='@min-[1280]:hidden fixed inset-0 blur-px top-10'>
                    <div className='absolute h-[12%] md:w-[25%] max-md:w-[45%] max-sm:w-[65%] bg-white bottom-0 right-0 '></div>
                    <Spline
                        //scene="https://prod.spline.design/19vkhsMOvXaLN8X4/scene.splinecode"
                        //scene="https://prod.spline.design/oWIxdLDOFI8Z6ATf/scene.splinecode"
                        //scene="https://prod.spline.design/JL5jsKmpBhOh7TAx/scene.splinecode"
                        scene="https://prod.spline.design/yxQVEPwLFt9SuZjo/scene.splinecode"
                    />
                </div>
                <div className='relative  mx-auto h-full w-full max-w-11xl flex flex-col text-lg  font-serif '>
                    <div className='flex items-center justify-around  max-md:flex-wrap gap-5  w-full max-md:h-[50%] md:h-full'>
                        <div className=' m-4 h-full md:h-full w-full md:w-[70%] lg:w-[75%] '>
                            <Map />
                        </div>
                            <div className='absolute top-1 right-12 flex flex-col items-center justify-center max-md:hidden'>
                            <span className={`${emergencyStatus? "cursor-pointer" : "cursor-not-allowed"}`}><TargetAllocation active={emergencyStatus} /></span>
                            <h1 className={`font-serif font-medium md:text-xl lg:text-2xl ${emergencyStatus ? " text-black" : "text-gray-500"}`}>Allocation</h1>
                            </div > 
                        
                        <motion.div
                            initial={{
                                boxShadow: "0px 0px 10px 2px rgba(8,112,184,0.5)",

                            }}

                            whileHover={{
                                boxShadow: "0px 10px 40px rgba(8,112,184,0.7)",
                                y: -5
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}

                            className="max-md:p-4 md:p-5 m-4 bg-white rounded shadow-md max-sm:w-full sm:w-[50%] md:w-[30%] lg:w-[20%]  max-sm:text-sm font-serif sm:text-lg md:text-md 2xl:text-2xl font-medium space-y-3">
                            <h2 className="font-bold max-sm:text-sm font-serif sm:text-md md:text-xl 2xl:text-2xl  space-y-3 border-b pb-1">🗺️ Symbols & Zones</h2>

                            <div><FaGlobeAsia className="inline text-sky-700" /> <span className="ml-2">Earthquake</span></div>
                            <div><FaFire className="inline text-amber-500" /><span className="ml-2">Wildfire</span></div>
                            <div><FaWater className="inline text-sky-400" /> <span className="ml-2">Flood</span></div>
                            <div><FaLeaf className="inline text-amber-600" /> <span className="ml-2">Drought</span></div>
                            <div>🔴 <span className="ml-2">Danger Zone</span></div>
                            <div>🟡 <span className="ml-2">Warning Zone</span></div>
                            <div>🟢 <span className="ml-2">Safe Zone</span></div>
                        </motion.div>
                    </div>
                    <Divider className='mt-8' />
                    <div className="relative">
                        <div className='h-full w-full  relative flex items-center justify-between gap-1'>
                            <div ref={imageDiv} className=' max-xl:hidden absolute  flex top-16 items-center  justify-center h-full  max-2xl:w-[32%] w-[40%] '>
                                <img ref={imageRef} src="https://via.placeholder.com/200" alt="disaster image" className='h-96 w-72  rounded-2xl ' />
                            </div>
                            <div className='relative px-2 | lg:px-3 | xl:px-4 w-full '>
                                <div className='w-full'>
                                    <h2 className='text-[15vw] | lg:text-[9vw] font-sans-primary tracking-tight bg-clip-text text-transparent | dark:text-grayDark-100 leading-0.4 text-balance '
                                        style={{
                                            backgroundImage: "url('https://plus.unsplash.com/premium_photo-1719943510748-4b4354fbcf56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        Priority Alerts
                                    </h2>
                                </div>
                            </div>
                        </div>
                        <div className=" max-xl:hidden min-h-[42vh] flex items-center justify-end xl:flex-wrap gap-5  max-w-7xl max-md:h-[50%] md:h-full ml-auto mr-10">
                            <DisasterRisk img={"https://images.unsplash.com/photo-1627024165011-6a9e2c4ea343?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"}
                                risk={'Disaster Risk'} onClick={openDisasterTrigger} />
                            <DisasterRisk img={"https://plus.unsplash.com/premium_photo-1661395135840-0a628d8a609a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"} risk={'Help Requests'} onClick={openHelpRequestTrigger} />
                            <DisasterRisk img={"https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"} risk={'Your Request'} onClick={openPersonalTrigger} />
                            <DisasterRisk img={"https://plus.unsplash.com/premium_photo-1682309650634-363db7521e6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1212"} risk={'Delivered Feedback'} onClick={openFeedbackTrigger} />

                        </div>

                        <div className='max-sm:hidden xl:hidden flex items-center justify-center  max-xl:flex-wrap gap-5 h-full w-full max-md:h-[50%] md:h-full'>
                            <Disaster_DraggableCard onDisasterClick={openDisasterTrigger} onFeedbackClick={openFeedbackTrigger} onHelpClick={openHelpRequestTrigger} onRequestClick={openPersonalTrigger} />
                        </div>
                        <div className='max-sm:block sm:hidden  flex items-center justify-center  max-xl:flex-wrap  h-fit w-full'>
                            <Disaster_small onDisasterClick={openDisasterTrigger} onFeedbackClick={openFeedbackTrigger} onHelpClick={openHelpRequestTrigger} onRequestClick={openPersonalTrigger} />
                        </div>
                    </div>


                    <Divider className='mt-8' />
                </div>
            </div>
            <HighAlertDisaster isOpen={openDisaster} onOpenChange={changeDisasterModal} />
            <HighAlertHelpRequest isOpen={openHelpRequest} onOpenChange={changeHelpRequestModal} alertRequest={highRiskData} />
            <PersonalRequest isOpen={openPersonal} onOpenChange={changePersonalModal} personalRequest={personalInfo} />
            <FeedbackRequest isOpen={openFeedback} onOpenChange={changeFeedbackModal} feedbackRequest={feedbackInfo} />
        </>
    )
}

export default HomeSetup