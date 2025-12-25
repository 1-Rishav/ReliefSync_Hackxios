import React, { useEffect, useState } from 'react'
import { TextHoverEffect } from '../ui/TextHoverEffect'
import { motion, AnimatePresence } from "framer-motion";
import { Button, Chip, form, Input, Textarea } from '@heroui/react'
import { RiArrowDownDoubleFill, RiArrowUpDoubleFill } from 'react-icons/ri';
import { getAllAgent, getAllNGO } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Geolocation from '../Helper/GeoLocation';
import { sendUrgentMail } from '../../store/slices/disasterSlice';
import { agencyStatus, changeAllocationAndStatus, changeAllocationOnly } from '../../store/slices/userSlice';

const UrgentVoiceMail = () => {

    const [openNGO, setOpenNGO] = useState(false);
    const [openAgent, setOpenAgent] = useState(false);
    const [openAllocation, setOpenAllocation] = useState(false);
    const [ngoData, setNgoData] = useState([]);
    const [agentData, setAgentData] = useState([]);
    const [recording, setRecording] = useState(false);
    const [message, setMessage] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [selectData, setSelectData] = useState({
        name: "",
        email: "",
        agencyId: null,
        userId: null
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { firstName, email, phone, _id: userId, allocationConfirm } = useSelector((state) => state.user)
    useEffect(() => {
        const fetchagency = async () => {
            try {
                const ngoRes = await dispatch(getAllNGO())
                const filteredNGO = ngoRes.data.filter(ngo => ngo.userId !== userId);
                setNgoData(filteredNGO);
                const agentRes = await dispatch(getAllAgent())
                const filteredAgent = agentRes.data.filter(agent => agent.userId !== userId);
                setAgentData(filteredAgent);
            } catch (error) {
                console.log(error);
            }
        }
        fetchagency();
    }, [refresh])

    const handleAgency = (name, email, status, agencyId, userId) => {
        if (status) {
            return toast.error("This agency is currently on field.");
        }
        setSelectData({
            name: name,
            email: email,
            agencyId: agencyId,
            userId
        });
    }

    const handleApprove = async () => {
        await dispatch(changeAllocationAndStatus());
    }
    const handleReject = async () => {
        await dispatch(changeAllocationOnly());
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectData((prev) => ({
            ...prev,
            [name]: value
        }));
        setMessage(value);
    };

    //📤 Send both transcript + audio blob to backend

    const startRecording = async () => {
        setLoading(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Use a local array to accumulate chunks
            const localChunks = [];

            let mimeType = "audio/webm;codecs=opus";
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                // Fall back
                mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
            }

            const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

            // Optional: emit dataavailable periodically (helps some browsers to produce chunks before stop)
            const TIMESLICE_MS = 1000; // 1s slices

            let finalTranscript = "";

            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";

            recognition.onresult = (event) => {
                for (let i = 0; i < event.results.length; ++i) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        const lastSpeech = result[0].transcript.toLowerCase().trim();
                        finalTranscript += lastSpeech + " ";
                        setMessage(finalTranscript);

                        if (lastSpeech.includes("send")) {
                            toast.info("Detected 'send' command.");
                            // Stop recognition & recorder — actual send will be done in recorder.onstop
                            try { recognition.stop(); } catch (e) { console.warn("recognition.stop err", e); }
                            try { if (recorder.state !== "inactive") recorder.stop(); } catch (e) { console.warn("recorder.stop err", e); }
                            setRecording(false);
                            setLoading(false);
                        }
                    }
                }
            };

            recognition.onerror = (err) => {
                console.error("recognition error", err);
            };

            recognition.onend = () => {
                // If recognition ends unexpectedly, ensure recorder stops so onstop runs and we can send
                if (recorder.state !== "inactive") {
                    try { recorder.stop(); } catch (e) { /* ignore */ }
                }
            };

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    localChunks.push(e.data);
                }
            };

            recorder.onerror = (err) => {
                console.error("MediaRecorder error:", err);
            };

            recorder.onstop = async () => {
                try {
                    stream.getTracks().forEach((t) => t.stop());
                } catch (err) {
                    console.warn("stream stop error", err);
                }

                const blobType = mimeType || "audio/webm";
                const audioBlob = new Blob(localChunks, { type: blobType });

                if (!audioBlob || audioBlob.size === 0) {
                    toast.error("Recording failed: audio empty.");
                    return;
                }

                await sendToBackend(finalTranscript.trim(), audioBlob);
            };

            recognition.start();
            // Start recorder with timeslice so ondataavailable is fired frequently. If you don't want slices, call recorder.start() without param.
            recorder.start(TIMESLICE_MS);
            setRecording(true);
            toast.success("🎙️ Speak your emergency message");
        } catch (error) {
            toast.error("Microphone access denied or error: " + (error.message || error));
            setLoading(false);
        }
    };

    const sendToBackend = async (transcriptSpeech, audioBlob) => {

        const { lat, lng } = await Geolocation();
        const location = { latitude: lat.toFixed(6), longitude: lng.toFixed(6) };

        const formData = new FormData();
        formData.append("audio", audioBlob, "help_audio.webm");
        formData.append("transcript", transcriptSpeech);
        formData.append("ngo_Email", selectData.email);
        formData.append("ngo_UserId", selectData.userId);
        formData.append("userName", firstName);
        formData.append("userEmail", email);
        formData.append("userContact", phone);
        formData.append("lat", location.latitude);
        formData.append("lng", location.longitude);

        const res = await dispatch(sendUrgentMail(formData));
        if (res?.status === 200) {
            setMessage("");
            setSelectData({ name: "", email: "", agencyId: null, userId: null });
            toast.success(res.data.message);
            await dispatch(agencyStatus({ userId: selectData.agencyId }));
            setRefresh((prev) => !prev);
        } else {
            toast.error(`❌ ${res?.data?.message || "Send failed"}`);
            setMessage("");
            setSelectData({ name: "", email: "", agencyId: null, userId: null });
        }
    };

    return (
        <>
            <div className="relative w-full h-full mx-auto max-w-11xl">

                <div className='flex w-full h-full items-start justify-between max-lg:flex-col gap-1'>

                    <div className='max-lg:order-2 flex mx-auto items-center h-[70vh] w-[80%] justify-around flex-col'>
                        <div className="flex w-full max-md:h-[40%] md:h-full items-center justify-center bg-transparent">
                            <TextHoverEffect text="Urgency Help Box" />
                        </div>

                        <div className=" flex flex-col w-full max-w-4xl h-full items-start justify-center bg-transparent ">
                            <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Choose Agency" type="text" name="name" className='w-[50%]' isRequired isDisabled value={selectData.name} onChange={handleChange} />
                            <Textarea variant='flat' radius='full' color='success' labelPlacement='outside' size='sm' label="Urgency Message" type="text" name="description" minRows={3} value={message} onChange={handleChange} />
                        </div>

                        <Button
                            onClick={startRecording}
                            isLoading={loading}
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
                            } isDisabled={recording} size='lg' variant='shadow' color='success' radius='sm' className='h-[20%] w-[10%] text-3xl mb-2'>🎙️</Button>
                    </div>
                    <div className="flex lg:flex-col max-md:flex-wrap gap-2 items-center lg:w-[20%] w-full  h-full py-4 lg:space-y-6">
                        {/* NGO Section */}
                        <div className=" w-full flex flex-col items-center justify-center">
                            <div className="flex items-center justify-between w-[90%] bg-gray-100 px-4 py-2 rounded-xl shadow">
                                <span className="font-semibold text-gray-800 ">NGO's</span>
                                <button
                                    onClick={() => setOpenNGO(!openNGO)}
                                    className="h-8 w-8 cursor-pointer rounded-full bg-neutral-300 flex items-center justify-center"
                                >
                                    {openNGO ? (
                                        <RiArrowUpDoubleFill className="text-black" />
                                    ) : (
                                        <RiArrowDownDoubleFill className="text-black" />
                                    )}
                                </button>
                            </div>

                            <AnimatePresence>
                                {openNGO && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "25vh", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-2 w-[90%] rounded-xl bg-gray-100 overflow-y-auto p-3 flex flex-col gap-3"
                                    >
                                        {/* Content of NGO */}
                                        {ngoData?.map((ngo, index) => (
                                            <div key={index} onClick={(e) => { e.stopPropagation(); handleAgency(ngo.ngo_Name, ngo.officialEmail, ngo.status, ngo._id, ngo.userId); setOpenNGO(!openNGO) }} className="p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                                                <div
                                                    className="font-semibold text-gray-800 truncate w-[70%] text-ellipsis overflow-hidden whitespace-nowrap"
                                                    title={ngo.ngo_Name}
                                                >
                                                    {ngo.ngo_Name}
                                                </div>

                                                <div>{ngo.status ? (
                                                    <h1 className="text-xl font-medium text-black font-serif"><Chip size="sm"
                                                        color="danger"
                                                        variant="dot" ></Chip></h1>
                                                ) : (<h1 className="text-xl font-medium text-black font-serif"><Chip size="sm"
                                                    color="success"
                                                    variant="dot" ></Chip></h1>)}</div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Agent Section */}
                        <div className="w-full flex flex-col items-center">
                            <div className="flex items-center justify-between w-[90%] bg-gray-100 px-4 py-2 rounded-xl shadow">
                                <span className="font-semibold text-gray-800">Agent's</span>
                                <button
                                    onClick={() => setOpenAgent(!openAgent)}
                                    className="h-8 w-8 cursor-pointer rounded-full bg-neutral-300 flex items-center justify-center"
                                >
                                    {openAgent ? (
                                        <RiArrowUpDoubleFill className="text-black" />
                                    ) : (
                                        <RiArrowDownDoubleFill className="text-black" />
                                    )}
                                </button>
                            </div>

                            <AnimatePresence>
                                {openAgent && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "25vh", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-2 w-[90%] rounded-xl bg-gray-100 overflow-y-auto p-3 flex flex-col gap-3"
                                    >
                                        {agentData?.map((agent, index) => (
                                            <div key={index} onClick={(e) => { e.stopPropagation(); handleAgency(agent.name, agent.email, agent.status, agent._id, agent.userId); setOpenAgent(!openAgent) }} className="p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-100 flex items-center justify-between">
                                                <div
                                                    className="font-semibold text-gray-800 truncate w-[70%] text-ellipsis overflow-hidden whitespace-nowrap"
                                                    title={agent.name}
                                                >
                                                    {agent.name}
                                                </div>

                                                <div>{agent.status ? (
                                                    <h1 className="text-xl font-medium text-black font-serif"><Chip size="sm"
                                                        color="danger"
                                                        variant="dot" ></Chip></h1>
                                                ) : (<h1 className="text-xl font-medium text-black font-serif"><Chip size="sm"
                                                    color="success"
                                                    variant="dot" ></Chip></h1>)}</div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* Help confirmation */}
                        {allocationConfirm && (<div className="w-full flex flex-col items-center">
                            <div className="flex items-center justify-between w-[90%] bg-gray-100 px-4 py-2 rounded-xl shadow">
                                <span className="font-semibold text-gray-800">Confirm Allocation</span>
                                <button
                                    onClick={() => setOpenAllocation(!openAllocation)}
                                    className="h-8 w-8 cursor-pointer rounded-full bg-neutral-300 flex items-center justify-center"
                                >
                                    {openAllocation ? (
                                        <RiArrowUpDoubleFill className="text-black" />
                                    ) : (
                                        <RiArrowDownDoubleFill className="text-black" />
                                    )}
                                </button>
                            </div>

                            <AnimatePresence>
                                {openAllocation && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "12vh", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-2 w-[90%] rounded-xl bg-gray-100 overflow-y-auto p-3 flex gap-3"
                                    >

                                        <Button variant='flat' color='success' onClick={(e) => { e.stopPropagation(); handleApprove(); setOpenAllocation(!openAllocation) }} className="p-2 rounded shadow cursor-pointer flex items-center justify-center w-1/2 h-fit font-semibold text-gray-800 whitespace-nowrap text-ellipsis">
                                            YES

                                        </Button>
                                        <Button variant='flat' color='danger' onClick={(e) => { e.stopPropagation(); handleReject(); setOpenAllocation(!openAllocation) }} className="p-2 rounded shadow cursor-pointer flex items-center justify-center w-1/2 h-fit font-semibold text-gray-800 whitespace-nowrap text-ellipsis">

                                            NO

                                        </Button>

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>)}
                    </div>
                </div>


            </div>

        </>
    )
}

export default UrgentVoiceMail