import { motion, AnimatePresence } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { AreaToday } from '../AreaToday'
import { Button, Divider} from '@heroui/react'
import { areaReport, getAreaReport, precautionDetail } from '../../store/slices/disasterSlice'
import Geolocation from '../Helper/GeoLocation'
import { useDispatch } from 'react-redux'
import  { formatGemini ,FormattedResponse } from '../Helper/TextFormatter'

const TodayArea = () => {
    const [area, setArea] = useState(null);
    //const [todayArea , setTodayArea] = useState({data:[]});
    const [showNextButton, setShowNextButton] = useState(() => {
        const saved = sessionStorage.getItem("showNextButton");
        return saved ? JSON.parse(saved) : true; // default true
    });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [formatText , setFormatText] = useState(()=>{
        return localStorage.getItem("formatText")||"";
    })

    useEffect(()=>{
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchAreaDisaster = async()=>{
            const today = new Date().toLocaleDateString();
  const savedDate = localStorage.getItem("formatTextDate");
            const areaDisaster = await dispatch(getAreaReport(),{signal:signal});
            if(areaDisaster?.data?.areaDisaster?.length !== 0){
            setArea(areaDisaster?.data?.areaDisaster);
            if (savedDate !== today) {
    localStorage.removeItem("formatText");
    localStorage.removeItem("selectedIndex");
    localStorage.setItem("formatTextDate", today);
  }
            }else{
                setArea(null);
            }
        }
        fetchAreaDisaster();
        return () => controller.abort();
    }, [])

    const handleArea = async () => {
        setLoading(true)
        try {
            
            const { lat, lng } = await Geolocation();
            const data = {
                latitude: lat.toFixed(6),
                longitude: lng.toFixed(6)
            }            
            const res = await dispatch(areaReport(data));
            setArea(res.data);
            
        } catch (error) {
            setLoading(false)
        }finally{
            setLoading(false)
        }

    }
    const handleAI = async(disasterType , riskLevel , severity)=>{
        setLoading(true)
        try {
            const response = await dispatch(precautionDetail({disasterType , riskLevel , severity}));
            const text = response.data;
          const formatted = formatGemini(text);
           localStorage.setItem("formatText", formatted)
          setFormatText(formatted);
        } catch (error) {
            setLoading(false)
        } finally {
            setLoading(false)
        }
      
    }

    const handleNextStep = async(type , risk , severity,id) => {
        
        setShowNextButton(false);
        sessionStorage.setItem("showNextButton", JSON.stringify(false));
        await handleAI(type , risk , severity);

        localStorage.setItem("selectedIndex", id)
      window.dispatchEvent(new Event("selectedIndexChange"));

    };

    const handleCardData = async (data)=>{
        setFormatText(null);
        setShowNextButton(false);
        sessionStorage.setItem("showNextButton", JSON.stringify(false));
        await handleAI(data.disasterType , data.riskLevel , data.severity);
    }

    return (
        <>
            <div className='relative w-full h-full text-lg mx-auto max-w-11xl font-serif'>
                <div className='relative px-2 | lg:px-3 | xl:px-4 w-full '>
                                <div className='w-full'>
                                    <h2 className='text-[11vw] | lg:text-[9vw] font-sans-primary tracking-tight bg-clip-text text-transparent | dark:text-grayDark-100 leading-0.4 text-balance '
                                        style={{
                                            backgroundImage: "url('https://plus.unsplash.com/premium_photo-1719943510748-4b4354fbcf56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                        }}
                                    >
                                        My Area 
                                    </h2>
                                </div>
                            </div>
                {!area && <div className='relative  min-h-40 max-h-full w-full flex items-center justify-center'>
                    <Button onClick={handleArea} isLoading={loading}
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
                        } size='lg' variant='flat' color='success' radius='full' className='max-sm:w-36 flex items-center justify-center xl:text-2xl lg:text-xl md:text-lg max-md:text-md max-md:h-12 md:h-14 lg:h-16 xl:h-20 font-semibold '>My Area Today</Button>
                </div>}
                <div
                    className={`relative flex mx-auto items-center w-full gap-4 max-md:flex-wrap
        ${area ? 'justify-around' : 'justify-center'}`}
                >
                    {/* Left panel (AreaToday) animates its layout when `msg` changes */}
                    {area && <motion.div
                        layout
                        initial={{ opacity: 0, x: -200 }}
                        animate={{ opacity: 1, x: 0 }}

                        transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                        style={{ willChange: 'transform' }}
                        className='h-full w-1/3 max-lg:w-full max-lg:mx-auto flex flex-col items-center justify-center overflow-y-scroll max-lg:mb-2'

                    >
                        <AreaToday todayArea={area} newData={handleCardData} />
                        
                    </motion.div>}

                    {(!showNextButton || formatText) && area &&<>
                    
                    <AnimatePresence>
                        <>
                            <motion.div
                            
                                key="right-panel"
                                initial={{ x: 200, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 200, opacity: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                layout
                                style={{ willChange: 'transform' }}
                                className="max-md:h-[250px] md:h-[350px] lg:w-2/5  max-lg:w-[90%] max-lg:mx-auto border-2 shadow-lg rounded-2xl flex flex-col p-4  overflow-y-scroll text-justify "
                            >
                                {loading &&
                                <div className='flex items-center justify-center h-full w-full'>
                            <svg
                                className="animate-spin h-10 w-10 text-current"
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
                            </div>
                        }

                                <div>{<FormattedResponse html={formatText} />}</div>
                            </motion.div>
                        </>
                    </AnimatePresence>
                    </> }
                </div>
                {area && showNextButton && !formatText && <Button size='lg' variant='flat' color='success' radius='full' className='absolute right-5 bottom-0 max-sm:w-20 flex items-center justify-center xl:text-lg lg:text-md md:text-sm max-md:text-xs max-md:h-10 md:h-12 lg:h-14 font-semibold ' onClick={()=>{handleNextStep(area[0].disasterType , area[0].riskLevel , area[0].severity,area[0]._id)}}  >Next Step..</Button>}
                <Divider className='my-8' />
            </div>
        </>
    )
}

export default TodayArea