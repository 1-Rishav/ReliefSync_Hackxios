import React from "react";
import { FooterEffect } from "../ui/FooterEffect";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png"
//import { FloatingDockDemo } from "./Float_Icon";

export function Footer() {

  const navigate = useNavigate()
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scrolling
    });
  };
  return (
    (<FooterEffect>
      <div className="w-full h-full flex items-center justify-center pl-2 font-serif">
        <div className="w-full h-full grid lg:grid-cols-[20rem,auto,22rem] md:grid-cols-[15rem,auto,16rem] grid-cols-[4rem,auto,0] grid-rows-[15rem,12rem,14rem,3rem] md:grid-rows-[5rem,auto,3rem] lg:grid-rows-[5rem,auto,3rem]">
          <div className="bg-neutral-800 rounded-br-3xl row-start-1 col-start-1"></div>
          <div className=" md:row-start-2 md:col-end-2 ">
            <div className="relative top-0 h-full w-full lg:w-3/4 list-none flex flex-wrap items-start justify-center gap-2 text-white text-gradient cursor-pointer text-3xl font-bold">
              <span className="flex items-center justify-between gap-2"><img src={logo} width={60} height={60} alt=" Logo" />
                <div className="flex flex-col items-start justify-center gap-2 ">ReliefSync

                  <div className="text-sm flex flex-col items-start justify-between ">Together, we can make a difference
                    <div className="text-xs">&copy; {new Date().getFullYear()}. All rights reserved.</div>
                  </div>

                </div>
              </span>

            </div>
          </div>
          <div className="row-start-2 col-start-2">
            <div className="mx-0 h-fit w-full flex items-center justify-center gap-2 ">

              <div className="h-full w-full text-neutral-100 list-none text-xl cursor-pointer">
                <li className="sm:my-3 max-sm:my-3 text-gray-500 cursor-not-allowed">Explore</li>
                <li className="lg:text-2xl lg:font-semibold mb-1" onClick={() => navigate('profile')}>Profile</li>
                {/*                 <li className="lg:text-2xl lg:font-semibold mb-1">Notification</li>
 */}                <li className="lg:text-2xl lg:font-semibold mb-1" onClick={() => navigate('helpRequest')}>Help Request</li>
                <li className="lg:text-2xl lg:font-semibold mb-1" onClick={() => navigate('delivered')}>Delivered</li>
                <li className="lg:text-2xl lg:font-semibold mb-1" onClick={() => navigate('events')}>Event Table</li>
              </div>
            </div>
          </div>
          <div className=" row-start-3 col-start-2 md:row-start-2 md:col-start-3">
            <div className="sm:mx-7  h-full w-full list-none flex flex-col items-start justify-center gap-3  text-white text-xl cursor-pointer">
              <li className="sm:my-3 text-gray-500">Get in touch</li>
              <li className="lg:text-2xl lg:font-semibold mb-1"><a href={`tel:${91 + 8271228935}`}>91+ 8271228935</a></li>
              <li className="lg:text-2xl lg:font-semibold mb-1">syncrelief@gmail.com</li>
              <li className="lg:text-2xl lg:font-semibold mb-1">AnadamNagar Mahalaxmi PG <br /> Ramapuram, Chennai</li>
            </div>
          </div>
          <div className="flex items-center justify-center bg-white rounded-tl-full md:row-start-3 md:col-start-3 row-start-4 col-start-2 cursor-pointer text-xl font-semibold" onClick={scrollToTop} ><div className="text-xs | lg:text-base">
            Gone too far, send me back up</div><div className=" animate-bounce">
              👆</div></div>
        </div>
      </div>
    </FooterEffect>)
  );
}
