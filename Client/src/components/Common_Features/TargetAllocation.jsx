import { motion } from "motion/react";
import { agencyEmergencyStatus } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";

const TargetAllocation = ({ active }) => {
    const dispatch = useDispatch();
  const handleAgency = async() => {
    await dispatch(agencyEmergencyStatus());
  };
  return (
    <motion.div  {...(active && {onClick: handleAgency})} whileTap={active ? {scale:2} : undefined} className="relative flex items-center justify-center w-[70px] h-[70px] mt-2">
      
      {/* Outer Ring */}

      <motion.div
        animate={
          active
            ? { scale: [1, 0.92, 1] }
            : { scale: 1 }
        }
        transition={{
          duration: 1.2,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
        className={`absolute w-[60px] h-[60px] rounded-full border-3 ${active ? "border-black" : "border-gray-400"} bg-white`}
      />

      {/* Middle Ring */}
      <motion.div
        animate={
          active
            ? { scale: [1, 0.88, 1] }
            : { scale: 1 }
        }
        transition={{
          duration: 1.2,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
          delay: 0.1,
        }}
        className={`absolute w-[30px] h-[30px] rounded-full border-3 ${active ? "border-black" : "border-gray-400"} bg-white`}
      />

      {/* Center Red */}
      <motion.div
        animate={
          active
            ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0px rgba(255,0,0,0.4)",
                  "0 0 20px rgba(255,0,0,0.9)",
                  "0 0 0px rgba(255,0,0,0.4)",
                ],
              }
            : {
                scale: 1,
                boxShadow: "0 0 0px rgba(255,0,0,0)",
              }
        }
        transition={{
          duration: 1.2,
          repeat: active ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="absolute w-[10px] h-[10px] rounded-full bg-red-600"
      />
    </motion.div>
  );
};

export default TargetAllocation;
