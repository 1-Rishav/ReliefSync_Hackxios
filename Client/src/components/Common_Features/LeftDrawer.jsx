import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const LeftDrawer = ({allOverview}) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <div className="sticky top-0 w-full z-30">
      {/* Toggle Button */}
      <div className="flex justify-start w-full px-4 py-2">
        <button
          onClick={toggleDrawer}
          className="flex items-center gap-2 font-serif font-medium bg-green-200 text-white px-4 py-1 rounded-full hover:bg-green-100 transition-all"
        >
          {open ? (
            <>
              <FiChevronUp className="text-xl text-green-800" /> <span className="text-green-800">Hide Overview</span>
            </>
          ) : (
            <>
              <FiChevronDown className="text-xl text-green-800" /> <span className="text-green-800">Show Overview</span>
            </>
          )}
        </button>
      </div>

      {/* Drawer Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full absolute overflow-hidden"
          >
            <div className="w-full bg-gradient-to-r from-green-100 to-teal-100 shadow-md rounded-xl px-4 py-3">
              {/* Scrollable Row of Boxes */}
              <div className="flex flex-nowrap items-center justify-evenly gap-4 overflow-x-auto overflow-y-hidden no-scrollbar py-2 w-full">

                {allOverview.map((data) => (
                  <motion.div
                    key={data.id}
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0  h-28 w-36 flex flex-col items-center justify-around bg-white border border-green-400 shadow-sm rounded-xl px-1 py-2 
                    text-center font-medium text-gray-700 
                    transition-all text-sm sm:text-base md:text-lg"
                  >
                    <div>
                    {data.title}
                    </div>
                    <div className="w-full overflow-x-auto whitespace-nowrap no-scrollbar">
          <span className="font-medium font-serif text-green-700 text-4xl">
            {data.count}
          </span>
        </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeftDrawer;
