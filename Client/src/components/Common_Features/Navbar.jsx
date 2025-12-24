"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { RiArrowDownDoubleFill, RiArrowUpDoubleFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import WalletConnect from "./WalletConnect";
import { useDisclosure } from "@heroui/react";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const MenuItem = ({ setActive, active, item, children, ...props }) => (
  <div onMouseEnter={() => setActive(item)} className="relative max-sm:mt-6">
    <motion.p
      transition={{ duration: 0.3 }}
      className="relative cursor-pointer max-md:px-8 max-md:text-5xl max-md:font-semibold text-xl font-semibold text-black hover:opacity-[0.9] dark:text-white group"
    >
      {item}
      <span className="absolute left-0 bottom-0 h-[2px] w-0 dark:bg-white transition-all duration-1000 md:group-hover:w-full"></span>
    </motion.p>
    {active === item && (
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={transition}
      >
        <div className="absolute top-[calc(100%_+_1.2rem)] left-2 md:left-1/2 transform -translate-x-1/2 pt-4">
          <motion.div
            transition={transition}
            layoutId="active"
            className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
          >
            <motion.div layout className="w-max h-full p-4" {...props}>
              {children}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    )}
  </div>
);

const Menu = ({ setActive, children }) => (
  <nav onMouseLeave={() => setActive(null)} className="max-lg:hidden relative rounded-full bg-transparent flex justify-center items-center space-x-4 px-8 py-6 gap-4">
    {children}
  </nav>
);

const ProductItem = ({ title, href, src }) => (
  <Link to={href} className="flex space-x-2">
    <img src={src} width={140} height={70} alt={title} className="flex-shrink-0 rounded-md shadow-2xl" />
    <div>
      <h4 className="text-xl font-bold mb-1 text-black dark:text-white">{title}</h4>
    </div>
  </Link>
);

const MobileCustomButton = ({ onClick, title }) => (
  <div onClick={onClick} className="cursor-pointer max-lg:px-8 max-lg:text-3xl max-lg:font-semibold text-lg font-semibold text-black hover:opacity-[0.9] dark:text-white">
    <span className="relative group">
      {title}
      <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black dark:bg-white transition-all duration-800 group-hover:w-full"></span>
    </span>
  </div>
);

const DeskTopCustomButton = ({ onClick, title }) => (
  <button onClick={onClick} className="relative cursor-pointer max-sm:px-5 max-sm:text-5xl max-sm:font-semibold text-xl font-semibold text-black hover:opacity-[0.9] dark:text-white group">
    {title}
    <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-black dark:bg-white transition-all duration-1000 sm:group-hover:w-full"></span>
  </button>
);

const WalletConnectionButton = ({ visible }) => (
  <div className={`max-lg:${visible} max-lg:px-8 inline-flex items-center space-x-2 text-sm px-2 py-1 rounded-lg dark:bg-neutral-800`}>
    <ConnectButton showBalance={true} accountStatus="" chainStatus="icon" />
  </div>
);

export const NavbarDemo = ({ toggleSidebar }) => {
  const { scrollYProgress } = useScroll();
  const [isTop, setIsTop] = useState(true);
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const { isConnected } = useAccount();

  const { isOpen: walletConnectionModal, onOpen: walletConnectionOpen, onOpenChange: walletConnectionClose } = useDisclosure();

  useEffect(() => {
    const handleResize = () => {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight;
      if (!scrollable) {
        setVisible(true); // Always visible if no scrolling possible
        setIsTop(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (open) {
      // Disable background scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount (good practice)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    const direction = current - scrollYProgress.getPrevious();
    const scrollable = document.documentElement.scrollHeight > window.innerHeight;

    if (!scrollable) return; // Lock navbar visible

    if (current < 0.03) {
      setIsTop(true);
      setVisible(true);
    } else if (current < 0.08) {
      setIsTop(false);
      setVisible(true);
    } else if (direction < 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });
  return (
    <>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sticky top-3 inset-x-0 z-[5000]"
          >
            <div className="w-full mx-auto max-w-11xl flex justify-center">
              <motion.div
                initial={{ width: "90%", borderRadius: "9999px" }}
                animate={{
                  width: isTop ? "90%" : "60%",
                  borderRadius: "9999px",
                  backgroundColor: isTop ? "rgba(243,244,246,1)" : "rgba(255,255,255,0.6)",
                  boxShadow: isTop
                    ? "none"
                    : "0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)"
                }}
                transition={transition}
                className="h-14 lg:h-20 pl-4 lg:pl-10 pr-1 flex items-center justify-between"
              >
                {/* Left Icon */}
                <motion.div
                  onClick={toggleSidebar}
                  className="text-3xl cursor-pointer hover:text-emerald-500 hover:duration-100 hover:transition-all hover:animate-pulse hover:ease-in-out font-bold"
                >
                  <FaBars />
                </motion.div>

                {/* Desktop Menu */}
                <Menu setActive={setActive}>
                  {role === "admin" && (
                    <>
                      <div className="absolute top-0 flex items-center justify-center text-center font-serif font-bold text-gray-400 text-sm w-full h-5 p-2">
                        HOT KEYS
                      </div>
                      <DeskTopCustomButton onClick={() => { isConnected ? navigate("disaster-report") : walletConnectionOpen() }} title="Disaster Report" />
                      <MenuItem setActive={setActive} active={active} item="Verification">
                        <div className="text-sm grid justify-start items-center md:grid-cols-2 gap-4 md:gap-10 p-1 md:p-4">
                          <ProductItem title="NGO-Verification" src={"images.Gem2"} href="ngo-verification" />
                          <ProductItem title="Agent-Verification" src={"images.Quick1"} href="agent-verification" />
                        </div>
                      </MenuItem>
                      <MenuItem setActive={setActive} active={active} item="Agency-Status">
                        <div className="text-sm grid justify-start items-center md:grid-cols-2 gap-4 md:gap-10 p-1 md:p-4">
                          <ProductItem title="NGO's Status" src={"images.Gem2"} href="ngo-status" />
                          <ProductItem title="Agent's Status" src={"images.Quick1"} href="agent-status" />
                        </div>
                      </MenuItem>
                    </>
                  )}
                  {role === "gov_Agent" && (
                    <>
                      <div className=" absolute top-0 flex items-center justify-center text-center font-serif font-bold text-gray-400 text-sm w-full h-5 p-2">HOT KEYS</div>
                      <DeskTopCustomButton onClick={() => { isConnected ? navigate("disaster-report") : walletConnectionOpen() }} title="Disaster Report" />
                      <DeskTopCustomButton onClick={() => { isConnected ? navigate("help") : walletConnectionOpen() }} title="Help Desk" />
                      <DeskTopCustomButton onClick={() => navigate("urgent-voice-mail")} title="Voice Mail" />
                    </>
                  )}
                  {role === "citizen" && (
                    <>
                      <div className=" absolute top-0 flex items-center justify-center text-center font-serif font-bold text-gray-400 text-sm w-full h-5 p-2">HOT KEYS</div>
                      <DeskTopCustomButton onClick={() => { isConnected ? navigate("disaster-report") : walletConnectionOpen() }} title="Disaster Report" />
                      <DeskTopCustomButton onClick={() => { isConnected ? navigate("help") : walletConnectionOpen() }} title="Help Desk" />
                      <DeskTopCustomButton onClick={() => navigate("urgent-voice-mail")} title="Voice Mail" />
                    </>
                  )}
                  {role === "ngo" && (
                    <>
                      <div className=" absolute top-0 flex items-center justify-center text-center font-serif font-bold text-gray-400 text-sm w-full h-5 p-2">HOT KEYS</div>
                      <DeskTopCustomButton onClick={() => { isConnected ? navigate("disaster-report") : walletConnectionOpen() }} title="Disaster Report" />
                      <DeskTopCustomButton onClick={() => { isConnected ? navigate('help') : walletConnectionOpen() }} title="Help Desk" />
                      <DeskTopCustomButton onClick={() => navigate("urgent-voice-mail")} title="Voice Mail" />
                    </>
                  )}
                </Menu>

                {/* Right Side Buttons */}
                <motion.div className="flex items-center justify-center ">
                  {open && (
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-16 absolute overflow-hidden overflow-y-scroll py-2  z-10 lg:hidden left-0 h-[60vh] w-[100%] rounded-xl bg-neutral-100 flex flex-col gap-3 top-20"
                    >
                      {role === "admin" && (
                        <>
                          <div className=" absolute top-0 flex items-center overflow-hidden justify-center text-center font-serif font-bold text-gray-400 text-sm w-full h-5 p-10">HOT KEYS</div>
                          <MobileCustomButton onClick={() => { isConnected ? navigate("disaster-report") : walletConnectionOpen(); setOpen(!open) }} title="Disaster Report" />
                          <MobileCustomButton onClick={() => { isConnected ? navigate("ngo-verification") : walletConnectionOpen(); setOpen(!open) }} title="NGO-Verification" />
                          <MobileCustomButton onClick={() => { isConnected ? navigate("agent-verification") : walletConnectionOpen(); setOpen(!open) }} title="Agent-Verification" />
                          <MobileCustomButton onClick={() => { isConnected ? navigate("ngo-status") : walletConnectionOpen(); setOpen(!open) }} title="NGO's Status" />
                          <MobileCustomButton onClick={() => { isConnected ? navigate("agent-status") : walletConnectionOpen(); setOpen(!open) }} title="Agent's Status" />
                          <WalletConnectionButton />
                        </>
                      )}
                      {role === "gov_Agent" && (
                        <>
                          <div className=" absolute top-0 flex items-center justify-center text-center font-serif font-bold text-gray-400 text-sm w-full h-5 p-10">HOT KEYS</div>
                          <MobileCustomButton onClick={() => { isConnected ? navigate("disaster-report") : walletConnectionOpen(); setOpen(!open) }} title="Disaster Report" />
                          <MobileCustomButton onClick={() => { isConnected ? navigate("help") : walletConnectionOpen(); setOpen(!open) }} title="Help Desk" />
                          <MobileCustomButton onClick={() => { navigate("urgent-voice-mail"); setOpen(!open) }} title="Voice Mail" />
                          <WalletConnectionButton />
                        </>
                      )}
                      {role === "citizen" && (
                        <>
                          <div className=" absolute top-0 flex items-center justify-center text-center font-serif font-bold text-gray-400 text-sm w-full h-5 p-10">HOT KEYS</div>
                          <MobileCustomButton onClick={() => { isConnected ? navigate("disaster-report") : walletConnectionOpen(); setOpen(!open) }} title="Disaster Report" />
                          <MobileCustomButton onClick={() => { isConnected ? navigate("help") : walletConnectionOpen(); setOpen(!open) }} title="Help Desk" />
                          <MobileCustomButton onClick={() => { navigate("urgent-voice-mail"); setOpen(!open) }} title="Voice Mail" />
                          <WalletConnectionButton />
                        </>
                      )}
                      {role === "ngo" && (
                        <>
                          <div className=" absolute top-0 flex items-center justify-center text-center font-serif font-bold text-gray-400 text-sm w-full h-5 p-10">HOT KEYS</div>
                          <MobileCustomButton onClick={() => { isConnected ? navigate("disaster-report") : walletConnectionOpen(); setOpen(!open) }} title="Disaster Report" />
                          <MobileCustomButton onClick={() => { isConnected ? navigate("help") : walletConnectionOpen(); setOpen(!open) }} title="Help Desk" />
                          <MobileCustomButton onClick={() => { navigate("urgent-voice-mail"); setOpen(!open) }} title="Voice Mail" />
                          <WalletConnectionButton />
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Mobile Toggle */}
                  <button
                    onClick={() => setOpen(!open)}
                    className="lg:hidden h-10 w-10 rounded-full bg-transparent dark:bg-neutral-800 flex flex-col items-center justify-center"
                  >
                    {open ? (
                      <RiArrowUpDoubleFill className="h-8 w-8 text-black dark:text-neutral-400 shadow-lg bg-neutral-300 rounded-full " />
                    ) : (
                      <RiArrowDownDoubleFill className="h-8 w-8 text-black dark:text-neutral-400 shadow-lg bg-neutral-300 rounded-full " />
                    )}
                  </button>
                  <WalletConnectionButton visible="hidden" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <WalletConnect isOpen={walletConnectionModal} onOpenChange={walletConnectionClose} />
    </>
  );
};