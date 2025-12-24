import { FaCog } from "react-icons/fa";
import { BsLayoutSidebar } from "react-icons/bs";
import { LiaHandsHelpingSolid, LiaDonateSolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { VscSymbolEvent } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { LiaTasksSolid } from "react-icons/lia";
import { Button, Divider, useDisclosure } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../store/slices/authSlice";
import UserAvatar from './UserAvatar'
import NotificationModal from "../Helper/Modals/NotificationModal";
import { sosRequest } from "../../store/slices/disasterSlice";
import Geolocation from "../Helper/GeoLocation";
import { helpRequestSubmit } from "../../ConnectContract/Web3Connection";
import { useAccount } from "wagmi";
import { changeFeedBack } from "../../store/slices/userSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import WalletConnect from "./WalletConnect";

const BarItems = ({ label, icon, onClick, active }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-start w-full gap-3 p-2  rounded-lg  hover:bg-gray-300 cursor-pointer ${active ? 'bg-gray-300' : ''}`}
  >
    <div className="text-lg">{icon}</div>
    <span>{label}</span>

  </div>
)

const CustomButton = ({ load, onClick }) => (
  <Button isLoading={load}
    onClick={onClick}
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
    } color="danger" radius='sm' variant='shadow' size='lg' className=' font-bold text-xl font-serif flex items-center justify-center w-full tracking-wider leading-10 h-full'>SOS</Button>
)
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [loading, setLoading] = useState(false);
  const { isOpen: notificationModal, onOpen, onOpenChange } = useDisclosure();
  const { role } = useSelector(state => state.user);
  const [activeItem, setActiveItem] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, _id: userId, phone } = useSelector(state => state.user)
  const { address,isConnected } = useAccount();

    const { isOpen: walletConnectionModal, onOpen: walletConnectionOpen, onOpenChange: walletConnectionClose } = useDisclosure();
  
  const handleLogout = async () => {
    await dispatch(logOut())
  }

  const handleProfile = async () => {
    if(isConnected)
    navigate('profile');
  else
    walletConnectionOpen();
    toggleSidebar()
  }

  const handleDashboard = async () => {
    navigate('/');
    setActiveItem('dashboard');
    toggleSidebar();
  }
  const handleHelpRequest = async () => {
    if(isConnected){
    navigate('helpRequest');
    setActiveItem('HelpRequest');
  }else{
    walletConnectionOpen();
  }
    toggleSidebar();
  }

  const handleDonation = async () => {
    if(isConnected){
    navigate('delivered');
    setActiveItem('Donate')
  }else{
    walletConnectionOpen();
  }
    toggleSidebar();
  }
  const handleEventTable = async () => {
    if(isConnected){
    navigate('events');
    setActiveItem('EventTable')
  }else{
    walletConnectionOpen();
  }
    toggleSidebar();
  }
  const handleTask = async () => {
    if(isConnected){
    navigate('task');
    setActiveItem('Tasks')
    }else{
    walletConnectionOpen();
    }
    toggleSidebar();
  }

  const handleNotification = async () => {
    onOpen();
    toggleSidebar();
    setActiveItem('Notification');
  }

  const handleAllocated = async () => {
    if(isConnected){
    navigate('allocated-task');
    setActiveItem('AllocatedTask')
  }else{
    walletConnectionOpen();
  }
    toggleSidebar();
  }

  const handleSOS = async () => {
    setLoading(true);
    try {
      const { lat, lng } = await Geolocation();
      const data = {
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6)
      }
      const report = await dispatch(sosRequest(data))
      console.log('report', report)
      const requestType = "SOS";
      const description = "";
      const ipfsUrl = "";
      const upi = "";
      const FloodItem = report?.data?.result?.find(item => item?.disasterType?.includes('Flood'))
      if (FloodItem) {
        const helpRequest = await helpRequestSubmit([userId, requestType, FloodItem.riskLevel, FloodItem.severity, description, FloodItem.latitude, FloodItem.longitude, FloodItem.disasterType, ipfsUrl, phone, upi], address);
        if (helpRequest.status === 'success') {
          await dispatch(changeFeedBack({ status: true }))
          toast.success(report?.data?.message)
        }
      }
      const WildFireItem = report?.data?.result?.find(item => item?.disasterType?.includes('Wildfire'))
      if (WildFireItem) {
        const helpRequest = await helpRequestSubmit([userId, requestType, WildFireItem.riskLevel, WildFireItem.severity, description, WildFireItem.latitude, WildFireItem.longitude, WildFireItem.disasterType, ipfsUrl, phone, upi], address);
        if (helpRequest.status === 'success') {
          await dispatch(changeFeedBack({ status: true }))
          toast.success(report?.data?.message)
        }
      }
      const DroughtItem = report?.data?.result?.find(item => item?.disasterType?.includes('Drought'))
      if (DroughtItem) {
        const helpRequest = await helpRequestSubmit([userId, requestType, DroughtItem.riskLevel, DroughtItem.severity, description, DroughtItem.latitude, DroughtItem.longitude, DroughtItem.disasterType, ipfsUrl, phone, upi], address);
        if (helpRequest.status === 'success') {
          await dispatch(changeFeedBack({ status: true }))
          toast.success(report?.data?.message)
        }
      }
    } catch (error) {
      error
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Sidebar Overlay only left side */}
      <aside
        className={`fixed inset-y-0 left-0 z-5000000 w-64 transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } backdrop-blur-lg bg-white/50 dark:bg-black/50 border-r border-gray-300`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center">

            <div>
              <BsLayoutSidebar size={20} onClick={toggleSidebar} className="h-9 w-9 mt-4 cursor-pointer text-gray-600" />
            </div>



          </div>

          <div className="flex-1 overflow-y-auto">
            {/* <div className="px-4 py-2 border-b border-gray-400 flex items-center">

            </div> */}
            <Divider className="my-1" />
            <div className="p-2 text-black max-h-[1200px] overflow-hidden">
              <div className='flex flex-col max-md:-top-28 max-sm:left-2 max-md:left-5  items-center justify-start  w-full h-full  gap-3'>
                <div><UserAvatar img={profile} width={60} height={60} /></div>
                <Button color="success" radius='sm' variant='flat' size='sm' className=' font-bold text-xl font-serif flex items-center justify-center ' onClick={handleProfile}>Profile</Button>
              </div>

            </div>
            <Divider className="my-1" />

            <div className=" flex items-center justify-center flex-col gap-1 w-full px-2 text-gray-700 text-xl font-medium  overflow-hidden">

              {role == "admin" && <>
                <CustomButton load={loading} onClick={handleSOS} />
                < BarItems
                  icon={<LuLayoutDashboard size={25} />}
                  label="Dashboard"
                  active={activeItem === 'dashboard'}
                  onClick={handleDashboard}
                />
                < BarItems
                  icon={<MdOutlineNotificationsActive size={25} />}
                  label="Notification"
                  active={activeItem === 'Notification'}
                  onClick={handleNotification}
                />
                < BarItems
                  icon={<LiaHandsHelpingSolid size={25} />}
                  label="Help Request"
                  active={activeItem === 'HelpRequest'}
                  onClick={handleHelpRequest}
                />

                < BarItems
                  icon={<LiaDonateSolid size={25} />}
                  label="Delivered"
                  active={activeItem === 'Donate'}
                  onClick={handleDonation}
                />
                < BarItems
                  icon={<VscSymbolEvent size={25} />}
                  label="Event Table"
                  active={activeItem === 'EventTable'}
                  onClick={handleEventTable}
                />
                <BarItems
                  icon={<LiaTasksSolid size={25} />}
                  label="Allocated Task"
                  active={activeItem === 'AllocatedTask'}
                  onClick={handleAllocated}
                />
              </>}
              {
                role == "citizen" && <>
                  <CustomButton load={loading} onClick={handleSOS} />

                  < BarItems
                    icon={<LuLayoutDashboard size={25} />}
                    label="Dashboard"
                    active={activeItem === 'dashboard'}
                    onClick={handleDashboard}
                  />
                  < BarItems
                    icon={<MdOutlineNotificationsActive size={25} />}
                    label="Notification"
                    active={activeItem === 'Notification'}
                    onClick={handleNotification}
                  />
                  < BarItems
                    icon={<LiaHandsHelpingSolid size={25} />}
                    label="Help Request"
                    active={activeItem === 'HelpRequest'}
                    onClick={handleHelpRequest}
                  />

                  < BarItems
                    icon={<LiaDonateSolid size={25} />}
                    label="Delivered"
                    active={activeItem === 'Donate'}
                    onClick={handleDonation}
                  />
                  < BarItems
                    icon={<VscSymbolEvent size={25} />}
                    label="Event Table"
                    active={activeItem === 'EventTable'}
                    onClick={handleEventTable}
                  />
                </>
              }
              {role == "ngo" &&
                <>
                  <CustomButton load={loading} onClick={handleSOS} />

                  < BarItems
                    icon={<LuLayoutDashboard size={25} />}
                    label="Dashboard"
                    active={activeItem === 'dashboard'}
                    onClick={handleDashboard}
                  />
                  < BarItems
                    icon={<MdOutlineNotificationsActive size={25} />}
                    label="Notification"
                    active={activeItem === 'Notification'}
                    onClick={handleNotification}
                  />
                  < BarItems
                    icon={<LiaHandsHelpingSolid size={25} />}
                    label="Help Request"
                    active={activeItem === 'HelpRequest'}
                    onClick={handleHelpRequest}
                  />
                  < BarItems
                    icon={<LiaTasksSolid size={25} />}
                    label="Tasks"
                    active={activeItem === 'Tasks'}
                    onClick={handleTask}
                  />

                  < BarItems
                    icon={<LiaDonateSolid size={25} />}
                    label="Delivered"
                    active={activeItem === 'Donate'}
                    onClick={handleDonation}
                  />
                  < BarItems
                    icon={<VscSymbolEvent size={25} />}
                    label="Event Table"
                    active={activeItem === 'EventTable'}
                    onClick={handleEventTable}
                  />
                </>
              }
              {role == "gov_Agent" &&
                <>
                  <CustomButton load={loading} onClick={handleSOS} />
                  < BarItems
                    icon={<LuLayoutDashboard size={25} />}
                    label="Dashboard"
                    active={activeItem === 'dashboard'}
                    onClick={handleDashboard}
                  />
                  < BarItems
                    icon={<MdOutlineNotificationsActive size={25} />}
                    label="Notification"
                    active={activeItem === 'Notification'}
                    onClick={handleNotification}
                  />
                  < BarItems
                    icon={<LiaHandsHelpingSolid size={25} />}
                    label="Help Request"
                    active={activeItem === 'HelpRequest'}
                    onClick={handleHelpRequest}
                  />
                  < BarItems
                    icon={<LiaTasksSolid size={25} />}
                    label="Tasks"
                    active={activeItem === 'Tasks'}
                    onClick={handleTask}
                  />

                  < BarItems
                    icon={<LiaDonateSolid size={25} />}
                    label="Delivered"
                    active={activeItem === 'Donate'}
                    onClick={handleDonation}
                  />
                  < BarItems
                    icon={<VscSymbolEvent size={25} />}
                    label="Event Table"
                    active={activeItem === 'EventTable'}
                    onClick={handleEventTable}
                  />
                </>
              }


            </div>
          </div>

          <div className="px-4 py-2 border-t border-gray-400 mt-auto my-5 flex items-center justify-between flex-col">
            <Button color="danger" radius='sm' variant='ghost' size='sm' className=' font-bold text-xl font-serif flex items-center justify-center ' onClick={handleLogout}>LogOut</Button>
          </div>
        </div>
      </aside>
      <NotificationModal isOpen={notificationModal} onOpenChange={onOpenChange} />
      <WalletConnect isOpen={walletConnectionModal} onOpenChange={walletConnectionClose} />
    </>
  );
};

export default Sidebar;
