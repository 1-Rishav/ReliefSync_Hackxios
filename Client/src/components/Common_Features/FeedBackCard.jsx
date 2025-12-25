import { Avatar } from "@heroui/react";
import { Meteors } from "../ui/BoxEffect";
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function InfiniteFeedBackView({ data = [], speed = 120 }) {
  Array.isArray(data) ? data : [data]
  const trackRef = useRef(null); // the <div> that we'll translate left/right
  const firstSetRef = useRef(null); // the first copy's container (we measure its width)
  const tweenRef = useRef(null); // store GSAP tween so we can pause/resume/kill
  const pauseCountRef = useRef(0); // to handle nested hover events

  // create / recreate GSAP animation whenever data or speed change
  useLayoutEffect(() => {
    const track = trackRef.current;
    const firstSet = firstSetRef.current;
    if (!track || !firstSet) return;


    // clean old tween if present
    if (tweenRef.current) {
      tweenRef.current.kill();
      tweenRef.current = null;
    }
    // if no items, nothing to animate
    if (!data || data.length === 0) return;


    // reset transform
    gsap.set(track, { x: 0 });


    // measure width of a single set (A)
    const firstWidth = Math.round(firstSet.getBoundingClientRect().width);
    if (!firstWidth || firstWidth === 0) return;


    const duration = Math.max(0.1, firstWidth / speed); // seconds


    // animate from x: 0 => -firstWidth, repeat forever. Because we rendered A + A,
    // jumping back to 0 is visually seamless.
    tweenRef.current = gsap.to(track, {
      x: -firstWidth,
      duration,
      ease: "none",
      repeat: -1,
    });

    // on resize we must recalc widths & restart animation
    let resizeId = null;
    const handleResize = () => {
      if (resizeId) cancelAnimationFrame(resizeId);
      resizeId = requestAnimationFrame(() => {
        if (tweenRef.current) tweenRef.current.kill();
        gsap.set(track, { x: 0 });
        const w = Math.round(firstSet.getBoundingClientRect().width);
        if (!w || w === 0) return;
        tweenRef.current = gsap.to(track, {
          x: -w,
          duration: Math.max(0.1, w / speed),
          ease: "none",
          repeat: -1,
        });
      });
    };


    window.addEventListener("resize", handleResize);


    return () => {
      window.removeEventListener("resize", handleResize);
      if (tweenRef.current) tweenRef.current.kill();
      tweenRef.current = null;
    };
  }, [data, speed]);

  // pause/resume utilities (using a counter so multiple nested enters/leaves don't conflict)
  const pause = () => {
    if (tweenRef.current && !tweenRef.current.paused()) tweenRef.current.pause();
  };
  const resume = () => {
    if (tweenRef.current && tweenRef.current.paused()) tweenRef.current.resume();
  };


  const handleCardEnter = () => {
    pauseCountRef.current += 1;
    pause();
  };
  const handleCardLeave = () => {
    pauseCountRef.current = Math.max(0, pauseCountRef.current - 1);
    if (pauseCountRef.current === 0) resume();
  };


  // wrapper-level enter/leave (in case user hovers between cards)
  const handleWrapperEnter = () => handleCardEnter();
  const handleWrapperLeave = () => handleCardLeave();

  function FeedbackCard({ item }) {

    return (
      <>
        <div className="relative w-full">
          {/* Gradient blur background */}
          <div className="absolute inset-0 h-full w-full scale-[0.70] transform rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />

          {/* Fixed size container */}
          <div
            className="relative max-sm:h-[230px] max-sm:w-[320px] h-[280px] w-[500px] rounded-2xl border border-gray-300 bg-white/80 px-4 py-2 shadow-xl flex flex-col"
          >
            {/* Scrollable content box */}
            <div className="flex items-center justify-between w-full h-fit">
              <div className="flex gap-5 items-start  w-full h-full">
                <Avatar src={item?.profile ?? `https://i.pravatar.cc/150?u=${encodeURIComponent(item?._id ?? item?.name ?? Math.random())}`} alt={item?.name ?? "avatar"} />
                <h1 className="text-xl font-medium text-black font-serif">
                  {item?.name ?? "Anonymous"}
                </h1>
              </div>
              <div className="flex flex-col items-end  w-full h-full">
                <h1 className="text-xl font-medium text-black font-serif">• Survivor</h1>
                <h1 className="text-xl font-light text-red-600 font-serif ">{item?.disasterType.toUpperCase()}</h1>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              <h1 className="text-2xl font-extralight font-serif text-black text-justify">{item?.feedBack ?? "No description provided."}
              </h1>
            </div>
            <div className="flex flex-col items-end justify-end w-full h-fit">
              <h1 className="text-xl font-extralight text-black font-serif">• Saved By</h1>
              <h1 className="text-xl font-light text-blue-900 font-serif">{(item?.organizationRole.toUpperCase() + ':- ' + item?.organization)}</h1>
            </div>
            {/* Meteor effect always pinned */}
            <Meteors number={2} />
          </div>
        </div>
        </>
    );
  }
  return (
    <div className="w-full overflow-hidden" onMouseEnter={handleWrapperEnter} onMouseLeave={handleWrapperLeave}>
      <div ref={trackRef} className="flex gap-4 will-change-transform cursor-default select-none">
        {/* first copy */}
        <div ref={firstSetRef} className="flex gap-4">
          {data?.map((item, idx) => (
            <div
              key={`a-${item?.id ?? idx}`}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
              onTouchStart={handleCardEnter}
              onTouchEnd={handleCardLeave}
              className="flex-shrink-0"
            >
              <FeedbackCard item={item} />
            </div>
          ))}
        </div>


        {/* second copy (duplicate) */}
        <div className="flex gap-4">
          {data.map((item, idx) => (
            <div
              key={`b-${item?.id ?? idx}`}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
              onTouchStart={handleCardEnter}
              onTouchEnd={handleCardLeave}
              className="flex-shrink-0"
            >
              <FeedbackCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}