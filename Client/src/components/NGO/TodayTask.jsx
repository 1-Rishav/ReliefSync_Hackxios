import React, { useState } from 'react'
import { PendingTask } from '../AreaToday'
import { motion, AnimatePresence } from 'motion/react'
import { Button, Divider } from '@heroui/react'
import { Link } from 'react-router-dom'
import { getPendingTask } from '../../ConnectContract/Web3Connection'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import Geolocation from '../Helper/GeoLocation'

const TodayTask = () => {
    const [tasks, setTasks] = useState(() => {
        // Load from sessionStorage if available
        const saved = sessionStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : null;
    });
    const [showNextButton, setShowNextButton] = useState(() => {
        const saved = sessionStorage.getItem("showNextButton");
        return saved ? JSON.parse(saved) : true; // default true
    });
    const [loading, setLoading] = useState(false)
    const [latitude, setLatitude] = useState(() => {
        const lat = sessionStorage.getItem("latitude");
        return lat ? JSON.parse(lat) : null;
    });
    const [longitude, setLongitude] = useState(() => {
        const lng = sessionStorage.getItem("longitude");
        return lng ? JSON.parse(lng) : null;
    });

    const { address } = useAccount()

    const handleGeoClick = async () => {
        const { lat, lng } = await Geolocation();
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        sessionStorage.setItem("latitude", JSON.stringify(lat.toFixed(6)));
        sessionStorage.setItem("longitude", JSON.stringify(lng.toFixed(6)));
    }

    const handleTask = async () => {
        try {
            setLoading(true)
            const raw = await getPendingTask(address);

            // Normalize  here
            const normalized = raw.map(t => ({
                ...t,

                id: parseInt(t.id),
                requestId: parseInt(t.requestId),
                cryptoEscrowWei: parseInt(t.cryptoEscrowWei),
                fiatRecordedPaise: parseInt(t.fiatRecordedPaise),
                timestamp: parseInt(t.timestamp),
            }));
            setTasks(normalized);
            sessionStorage.setItem("tasks", JSON.stringify(normalized));
            toast.success("Task Loaded Successfully")
            setLoading(false)
        } catch (error) {
            console.log(error);
            toast.info("No Tasks Pending Yet")
            setLoading(false)
        }

    }

    const handleNextStep = () => {
        setShowNextButton(false);
        sessionStorage.setItem("showNextButton", JSON.stringify(false));
        handleGeoClick();
    };

    return (
        <>
            <div className='relative w-full mx-auto max-w-11xl h-full flex flex-col items-center justify-between min-h-[65vh] '>
                <div className='relative px-2 | lg:px-3 | xl:px-4 w-full '>
                                <div className='w-full'>
                                    <h2 className='text-[16vw] | lg:text-[9vw] tracking-tight bg-clip-text text-transparent | dark:text-grayDark-100 leading-0.4 text-balance font-serif'
                                        style={{
                                            backgroundImage: "url('https://plus.unsplash.com/premium_photo-1719943510748-4b4354fbcf56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        Today's Task
                                    </h2>
                                </div>
                            </div>
                {!tasks && <div className='relative  min-h-40 max-h-full w-full flex items-center justify-center'>
                    <Button isLoading={loading}
                        spinner={
                            <svg
                                className="animate-spin h-5 w-5 text-current"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    fill="currentColor"
                                />
                            </svg>
                        } onClick={handleTask} size='lg' variant='flat' color='success' radius='full' className='max-sm:w-36 flex items-center justify-center xl:text-2xl lg:text-xl md:text-lg max-md:text-md max-md:h-12 md:h-14 lg:h-16 xl:h-20 font-semibold ' isDisabled={''}>Today's Task</Button>
                </div>}
                <div
                    className={`relative flex mx-auto items-center w-full gap-4 max-lg:flex-wrap
            ${tasks ? 'justify-around' : 'justify-center'}`}
                >
                    {/* Left panel (AreaToday) animates its layout when `msg` changes */}
                    {tasks && <motion.div
                        layout
                        initial={{ opacity: 0, x: -200 }}
                        animate={{ opacity: 1, x: 0 }}

                        transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                        style={{ willChange: 'transform' }}
                        className='h-full w-1/2 max-lg:w-full flex items-center justify-center overflow-y-scroll'

                    >
                        <PendingTask todayTask={tasks} />
                    </motion.div>}

                    {/* Right panel slides in from the right when msg === true */}
                    {!showNextButton && <AnimatePresence>

                        <div className='flex flex-col gap-5 max-lg:flex-wrap justify-center items-center'>
                            <motion.div
                                key="right-panel"
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                layout
                                style={{ willChange: 'transform' }}

                            >
                                <Button size='lg' variant='flat' color='success' radius='full' className='max-sm:w-36  sm:w-44 flex items-center justify-center lg:text-xl md:text-lg max-md:text-md max-md:h-12 md:h-14  xl:h-16 font-semibold ' isDisabled={''} > <a href={`tel:${tasks?.[0]?.phone}`}>Call Now</a> </Button>
                            </motion.div>
                            <motion.div
                                key="right-panel1"
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 300, opacity: 0 }}
                                transition={{ duration: 0.9, ease: 'easeOut' }}
                                layout
                                style={{ willChange: 'transform' }}

                            >

                                <Button size='lg' variant='flat' color='success' radius='full' className='max-sm:w-36 sm:w-44 flex items-center justify-center lg:text-xl md:text-lg max-md:text-md max-md:h-12 md:h-14  xl:h-16 font-semibold ' isDisabled={''}><Link to={`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${tasks?.[0]?.latitude},${tasks?.[0]?.longitude}`} target='_blank' >View on Map</Link></Button>
                            </motion.div>
                        </div>

                    </AnimatePresence>}
                </div>

                {tasks && showNextButton && <Button className='absolute right-5 bottom-0' size='md' onClick={handleNextStep}  >Next Step..</Button>}
                <Divider className='mt-6' />
            </div>

        </>
    )
}

export default TodayTask