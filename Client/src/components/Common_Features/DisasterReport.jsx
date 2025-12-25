import React, { useRef, useState } from 'react'
import { easeInOut, spring, motion } from 'motion/react'
import { Input, Button, Select, SelectSection, SelectItem, Divider } from '@heroui/react'
import UserAvatar from './UserAvatar'
import { MdOutlineEdit, MdMyLocation } from "react-icons/md";
import Geolocation from '../Helper/GeoLocation';
import { deleteTempImage, disasterEnquiry, tempImage } from '../../store/slices/disasterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getForecast, logForecast } from '../../ConnectContract/Web3Connection'
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import getDistanceFromLatLonInKm from '../Helper/CalculateDistance';


const CustomInput = ({ latitude, longitude, handleGeoClick, disabled }) => (
  <div className='flex items-center justify-between w-full h-full gap-4'>
    <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Latitude" type="text" isRequired name="latitude" value={latitude} isDisabled={!latitude} />
    <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Longitude" type="text" isRequired name="longitude" value={longitude} isDisabled={!longitude} />
    <Button size='md' variant='flat' color='success' radius='sm' className='flex items-center justify-center' onClick={handleGeoClick} isDisabled={disabled}><MdMyLocation size={50} className=' h-10 w-10 text-gray-700' /></Button>
  </div>
)

export const disasterType = [
  { key: "flood", label: "Flood" },
  { key: "earthquake", label: "EarthQuake" },
  { key: "wildfire", label: "WildFire" },
  { key: "drought", label: "Drought" },

]

const DisasterReport = () => {

  const { address } = useAccount();

  const [files, setFiles] = useState({
    file1: null,
    file2: null
  })
  const [url, setUrl] = useState({
    url1: null,
    url2: null
  })
  const [loading, setLoading] = useState(false)
  const [selectedDisaster, setSelectedDisaster] = useState({
    disasterType: '',
    latitude: '',
    longitude: '',
    duration: '',
    file1: null,
    file2: null
  })
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [disable, setDisable] = useState(false);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const fileInputRef1 = useRef(null);


  const { file1: image1, file2: image2 } = useSelector((state) => state.disasterReport)
  const { firstName, _id: userId } = useSelector((state) => state.user);
  //console.log(files.file1, files.file2)
  const handleFileChange = async (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: selectedFiles[0]
      }));
    }

    if (image1) {
      await dispatch(deleteTempImage({ file: image1 }, { req: 'deleteTempImage1' }));
    }


    const formData = new FormData();
    formData.append(name, selectedFiles[0]);
    const file1 = await dispatch(tempImage(formData, { req: 'uploadTempImage1' }));
    setUrl(prev => ({ ...prev, url1: file1 }))
  };
  const handleFileChange1 = async (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: selectedFiles[0]
      }));
    }

    if (image2) {
      await dispatch(deleteTempImage({ file: image2 }, { req: 'deleteTempImage2' }));
    }

    const formData = new FormData();
    formData.append(name, selectedFiles[0]);
    const file2 = await dispatch(tempImage(formData, { req: 'uploadTempImage2' }));
    setUrl(prev => ({ ...prev, url2: file2 }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedDisaster(prev => ({ ...prev, [name]: value }));
  }
  const isFormComplete =
    files.file1 &&
    files.file2 &&
    latitude.trim() !== '' &&
    longitude.trim() !== '' &&
    selectedDisaster.disasterType &&
    selectedDisaster.duration;


  const handleSubmit = async () => {
    setLoading(true);
    setDisable(true);
    try {
      const existingReports = await getForecast();

      // ✅ 2. Convert user input to float
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);

      // ✅ 3. Check if any report exists within 60km
      const FIVE_DAYS_IN_SECONDS = 86400 * 5;
      const today = Date.now() / 1000;
      const isNearbyReport = existingReports.some(report => {
        const reportTime = Number(report.timestamp);
        const reportLat = parseFloat(report.latitude);
        const reportLng = parseFloat(report.longitude);
        const recentReport = (today - reportTime) <= FIVE_DAYS_IN_SECONDS;
        const distance = getDistanceFromLatLonInKm(userLat, userLng, reportLat, reportLng);
        const isNearby = distance <= 60;

        return recentReport && isNearby;
      });

      if (isNearbyReport) {
        toast.info("This area's report has already been submitted. You can ask for help if needed.");
        return;  // ✅ STOP SUBMISSION
      }


      if (image1) {
        await dispatch(deleteTempImage({ file: image1 }, { req: 'deleteTempImage1' }));
      }
      if (image2) {
        await dispatch(deleteTempImage({ file: image2 }, { req: 'deleteTempImage2' }));
      }
      const formData = new FormData();

      Object.entries(selectedDisaster).forEach(([key, value]) => {
        if (key === 'file1') {
          formData.append('file1', files.file1);
        } else if (key === 'file2') {
          formData.append('file2', files.file2);
        } else if (key === 'latitude') {
          formData.append('latitude', latitude);
        } else if (key === 'longitude') {
          formData.append('longitude', longitude)
        } else {
          formData.append(key, value);
        }
      })

      //console.log(formData.get('longitude'), formData.get('latitude'))
      if (selectedDisaster.disasterType === 'flood') {
        const report = await dispatch(disasterEnquiry(formData, { req: 'enquiry' }));
        let forecast;
        if (report.data.disasterType && !report.data.description) {
          forecast = await logForecast([firstName, userId, report.data.disasterType, report.data.riskLevel, report.data.severity, report.data.latitude, report.data.longitude, report.data.ipfsUrl], address);
        }

        if (report.status == 200 && forecast.status === 'success') {
          toast.success(report.data.message)
        } else {
          toast.error(report.data.message)
        }
      }
      if (selectedDisaster.disasterType === 'wildfire') {
        const report = await dispatch(disasterEnquiry(formData, { req: 'fireEnquiry' }))
        let forecast;
        if (report.data.disasterType) {
          forecast = await logForecast([firstName, userId, report.data.disasterType, report.data.riskLevel, report.data.severity, report.data.latitude, report.data.longitude, report.data.ipfsUrl], address)
        }
        if (report.status == 200 && forecast.status === 'success') {
          toast.success(report.data.message)
        } else {
          toast.error(report.data.message)
        }
      }
      if (selectedDisaster.disasterType === 'drought') {
        const report = await dispatch(disasterEnquiry(formData, { req: 'dryEnquiry' }))
        let forecast;
        if (report.data.disasterType) {
          forecast = await logForecast([firstName, userId, report.data.disasterType, report.data.riskLevel, report.data.severity, report.data.latitude, report.data.longitude, report.data.ipfsUrl], address)
        }
        if (report.status == 200 && forecast.status === 'success') {
          toast.success(report.data.message)
        } else {
          toast.error(report.data.message)
        }
      }
    } catch (error) {
      return;
    } finally {
      setSelectedDisaster({
        disasterType: '',
        duration: '',
        latitude: '',
        longitude: '',
        description: '',
        requestType: '',
        file1: null,
        file2: null
      });
      setLatitude('');
      setLongitude('');
      fileInputRef.current.value = null;
      fileInputRef1.current.value = null;
      setFiles({ file1: null, file2: null });
      setUrl({ url1: null, url2: null });
      setLoading(false)
      setDisable(false);
    }
  }

  const handleGeoClick = async () => {
    const { lat, lng } = await Geolocation();
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
  }

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,

          filter: "blur(5px)"
        }}
        animate={{
          opacity: 1,

          filter: "blur(0px)"
        }}
        transition={{
          duration: 0.4,
          type: spring,
          stiffness: 100,
          damping: 20,
          mass: 2,
          ease: easeInOut
        }}
        className=" flex flex-col items-center justify-center gap-4 w-full h-full mx-auto max-w-11xl p-2 ">
        <div className=' max-sm:text-3xl  md:text-4xl text 3xl:text-6xl font-semibold'>Report</div>
        <Divider className='my-4' />
        <div className='flex max-sm:w-[90%] sm:w-[55%] items-center justify-center flex-col gap-2  '>
          <div className="p-4 text-black max-h-[1200px] overflow-hidden">
            <div className=' flex  max-md:-top-28 max-sm:left-2 max-md:left-5  items-center justify-start  w-full h-full  md:gap-5'>
              <div className="group relative w-full h-full" >
                <div className="relative border-2 rounded-lg border-gray-200 bg-gray-100 h-fit w-fit overflow-hidden">
                  {/* Avatar Image */}
                  <UserAvatar img={url.url1} width={140} height={230} />

                  {/* Icon Overlay */}
                  {!disable && (
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 group-hover:backdrop-blur-sm transition-all duration-300 cursor-pointer"
                      tabIndex={0}
                      role="button"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <MdOutlineEdit
                        className={`text-white transition-opacity duration-300 ${disable
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "opacity-0 group-hover:opacity-100 cursor-pointer"
                          }`}
                        size={40}
                      />
                    </span>
                  )}
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    name="file1"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="group relative w-full h-full">
                <div className="relative border-2 rounded-lg border-gray-200 bg-gray-100 h-fit w-fit overflow-hidden">
                  {/* Avatar Image */}
                  <UserAvatar img={url?.url2} width={140} height={230} />

                  {/* Icon Overlay */}
                  {!disable && (
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 group-hover:backdrop-blur-sm transition-all duration-300 cursor-pointer"
                      tabIndex={0}
                      role="button"
                      onClick={() => fileInputRef1.current.click()}
                    >
                      <MdOutlineEdit
                        className={`text-white transition-opacity duration-300 ${disable
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "opacity-0 group-hover:opacity-100 cursor-pointer"
                          }`}
                        size={40}
                      />
                    </span>
                  )}
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef1}
                    className="hidden"
                    name="file2"
                    onChange={handleFileChange1}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between w-full h-full gap-4'>
            <Select className=' flex items-center justify-center ' onChange={handleChange} label="Type of Disaster" isRequired variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' name="disasterType" isDisabled={disable} selectedKeys={selectedDisaster.disasterType ? [selectedDisaster.disasterType] : []}>

              {disasterType.map((calamity) => (
                <SelectItem key={calamity.key}>{calamity.label}</SelectItem>
              ))}
            </Select>

            <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Duration (in days)" type="text" isRequired name="duration" value={selectedDisaster.duration} onChange={handleChange} isDisabled={disable} />

          </div>
          {selectedDisaster?.disasterType === 'flood' && (
            <>
              <CustomInput latitude={latitude} longitude={longitude} handleGeoClick={handleGeoClick} disabled={disable} />
            </>
          )}
          {selectedDisaster?.disasterType === 'wildfire' && (
            <>
              <CustomInput latitude={latitude} longitude={longitude} handleGeoClick={handleGeoClick} disabled={disable} />
            </>
          )}
          {selectedDisaster?.disasterType === 'drought' && (
            <>
              <CustomInput latitude={latitude} longitude={longitude} handleGeoClick={handleGeoClick} disabled={disable} />
            </>
          )}

          <Button isLoading={loading}
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
            } isDisabled={!isFormComplete} size='md' variant='shadow' color='success' radius='sm' fullWidth onClick={handleSubmit} className='mt-4'>SUBMIT</Button>

        </div>
      </motion.div>
    </>
  )
}

export default DisasterReport