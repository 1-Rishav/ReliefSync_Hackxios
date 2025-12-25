import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "./ui/DraggableCard";

export function Disaster_DraggableCard({
  onDisasterClick,
  onHelpClick,
  onRequestClick,
  onFeedbackClick,
}) {
  const items = [
    {
      title: "Disaster Risk",
      image: "https://images.unsplash.com/photo-1627024165011-6a9e2c4ea343?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
      onClick: onDisasterClick,
    },
    {
      title: "Help Requests",
      image: "https://plus.unsplash.com/premium_photo-1661395135840-0a628d8a609a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
      onClick: onHelpClick,
    },
    {
      title: "Your Request",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
      onClick: onRequestClick,
    },
    {
      title: "Delivered Feedback",
      image: "https://plus.unsplash.com/premium_photo-1682309650634-363db7521e6d?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1212",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
      onClick: onFeedbackClick,
    },
  ];

  return (
    <DraggableCardContainer className="relative flex blur-[1px] min-h-screen w-full items-center justify-center overflow-clip">
      {items.map((item, index) => (
        <DraggableCardBody
          key={index}
          className={item.className}
          onClick={item.onClick}  // <-- this line is new
        >
          <img
            src={item.image}
            alt={item.title}
            className="pointer-events-none relative rounded-sm z-10 max-sm:h-64 max-sm:w-60 sm:h-72 sm:w-70 md:h-75 md:w-80 object-cover"
          />
          <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
            {item.title}
          </h3>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}
