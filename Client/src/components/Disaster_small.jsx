import { SmallCard } from "./ui/SmallCardEffect";

export function Disaster_small({onDisasterClick,
  onHelpClick,
  onRequestClick,
  onFeedbackClick,}) {
  const testimonials = [
    {
       name: "Disaster Risk",
      src: "https://images.unsplash.com/photo-1627024165011-6a9e2c4ea343?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      onClick: onDisasterClick,
    },
    {
       name: "Help Requests",
      src: "https://plus.unsplash.com/premium_photo-1661395135840-0a628d8a609a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
      onClick: onHelpClick,
    },
    {
       name: "Your Request",
      src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
      onClick: onRequestClick,
    },
    {
       name: "Delivered Feedback",
      src: "https://plus.unsplash.com/premium_photo-1682309650634-363db7521e6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1212",
      onClick: onFeedbackClick,
    },
  ];
  return <SmallCard testimonials={testimonials} />;
}
