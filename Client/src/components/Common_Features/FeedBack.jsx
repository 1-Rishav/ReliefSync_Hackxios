"use client";
import { ThreeDMarquee } from "@/components/ui/shadcn-io/3d-marquee";
import InfiniteFeedBackView from "./FeedBackCard";
import { useState } from "react";
import { useEffect } from "react";
import { fetchFeedbacks } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
export default function FeedBackBackground() {
    const images = [
        'https://images.unsplash.com/photo-1558448495-5ef3fce92344?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1677233860259-ce1a8e0f8498?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1600336153113-d66c79de3e91?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1617585411149-54e9fdf60348?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1624087181434-46b1bf7edbfe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1692364221415-654b20e6d1d2?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1630661620103-765e82f19394?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1604275689235-fdc521556c16?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        "https://images.unsplash.com/photo-1534862262637-373c120dcbcc?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1601231522153-4910f56cb71e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1726930984329-c836aca3dc96?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1634009653379-a97409ee15de?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1602980045360-d94be60e4775?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1602980068837-2d0df11d9e65?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1693563920446-3e77e164827c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1713316834832-f706df5dfb52?q=80&w=1184&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1697730363005-a0900a0b8b51?q=80&w=1206&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1617252820855-a829ba1babe7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1663312790058-ab05ec9c9984?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1619686767678-fc6fc6519448?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1701183741088-5c2180b65dd7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1716845059671-51f0dae81346?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1757700131108-431b1f99d288?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1507680465142-ef2223e23308?q=80&w=1051&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1591362955559-9dbe193bdc32?q=80&w=1163&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://plus.unsplash.com/premium_photo-1733342648363-81cd437f9e43?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1735049283053-640b0f11830d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1557837371-bf4d1892b695?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1536245344390-dbf1df63c30a?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1619686767678-fc6fc6519448?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    const [feedBackData , setFeedBackData]=useState([]);
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const response = await dispatch(fetchFeedbacks());
                setFeedBackData(response);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        }
        fetchData();
    },[])
    const feedbacks = [
        {
            _id: "1",
            name: "Rishav",
            
            disasterType: "WildFire",
            profile: "https://i.pravatar.cc/150?u=rishav",
            feedBack:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, voluptas! Dolores mollitia, officia quas repellendus sunt a, illo perspiciatis.",
            organization: "Raghav Coorporation",
            organizationRole: "NGO",
        },
        {
            _id: "2",
            name: "Anjali",
            disasterType: "Flood",
            profile: "https://i.pravatar.cc/150?u=anjali",
            feedBack:
                "Helping others in crisis is the greatest reward. Proud to be a part of rescue operations!",
            organization: "Government Relief Squad",
            organizationRole: "NGO",
        },
        {
            _id: "3",
            name: "Rahul",
            disasterType: "Earthquake",
            profile: "https://i.pravatar.cc/150?u=rahul",
            feedBack:
                "The sight of people reuniting with their families is unforgettable. Blessed to contribute.",
            organization: "Army Task Force",
            organizationRole: "Gov_Agent",
        },
    ];

    return (
        <div className="relative mx-auto my-5 flex max-sm:min-h-[400px] min-h-[600px] h-full w-full max-w-11xl flex-col items-center justify-between overflow-hidden">
            <div className='relative z-20 px-2 | lg:px-3 | xl:px-4 w-full'>
                <div className='w-full'>
                    <h2 className='text-[16vw] | lg:text-[9vw] font-serif tracking-tight bg-clip-text text-transparent | dark:text-grayDark-100 leading-0.4 text-balance '
                        style={{
                            backgroundImage: "url('https://plus.unsplash.com/premium_photo-1719943510748-4b4354fbcf56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        Survivors
                    </h2>
                </div>
            </div>{/* .length > 4 ? feedBackData : feedbacks?.concat(feedBackData) */}
            <div className="relative z-40 flex items-center w-full mb-5  h-full gap-5">
                <InfiniteFeedBackView data={feedBackData?.feedbacks?.length > 4 ? feedBackData?.feedbacks : feedbacks?.concat(feedBackData?.feedbacks)} speed={50} />
            </div>
            {/* overlay */}
            <div className="absolute inset-0 z-10 h-full w-full bg-black/20 dark:bg-black/40" />
            <ThreeDMarquee
                className="pointer-events-none absolute inset-0 h-full w-full"
                images={images}
            />
            
        </div>
        
    );
}