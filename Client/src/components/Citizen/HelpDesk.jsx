import React, { useRef, useState } from 'react'
import { easeInOut, spring, motion } from 'motion/react'
import { Input, Button, Select, SelectItem, Divider, Textarea } from '@heroui/react'
import UserAvatar from '../Common_Features/UserAvatar'
import { MdOutlineEdit, MdMyLocation } from "react-icons/md";
import Geolocation from '../Helper/GeoLocation';
import { deleteTempImage, disasterEnquiry, tempImage } from '../../store/slices/disasterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount } from 'wagmi';
import { helpRequestSubmit } from '../../ConnectContract/Web3Connection';
import { toast } from 'react-toastify';
import { changeFeedBack } from '../../store/slices/userSlice';


export const CommonFunction = ({ latitude, longitude, selectedDisaster, handleChange, handleGeoClick, disabled, descriptionError, phoneError, upiError, upiBlank, upiFormat }) => (

  <>
    <div className='flex items-center justify-between w-full h-full gap-4'>

      <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Latitude" type="text" isRequired name="latitude" value={latitude} isDisabled={!latitude} />
      <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Longitude" type="text" isRequired name="longitude" value={longitude} isDisabled={!longitude} />
      <Button size='md' variant='flat' color='success' radius='sm' className='flex items-center justify-center' onClick={handleGeoClick} isDisabled={disabled}><MdMyLocation size={50} className=' h-10 w-10 text-gray-700' /></Button>
    </div>
    <div className='flex items-center justify-between w-full h-full gap-4'>
      <Textarea variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Impact and Problems Faced" placeholder='Briefly describe your situation, the impact of the disaster, and any problems you’re currently facing.' type="text" isRequired name="description" value={selectedDisaster.description} onChange={handleChange} isDisabled={disabled} isInvalid={descriptionError}
        errorMessage={
          descriptionError
            ? "Description must be at least 15 characters long"
            : ""
        } />
    </div>
    <div className='flex items-center justify-between w-full h-full gap-4'>
      <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Phone No." type="number" isRequired name="phone" value={selectedDisaster.phone} onChange={handleChange} isDisabled={disabled} className={`${selectedDisaster.requestType === "funds" ? "w-full" : "w-1/2"}`} isInvalid={phoneError}
        errorMessage={
          phoneError
            ? "Enter a valid Indian phone number (10 digits)"
            : ""
        } />
      {selectedDisaster.requestType === "funds" && <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="UPI Id" type="text" isRequired name="upi" value={selectedDisaster.upi} onChange={handleChange} isDisabled={disabled} isInvalid={upiError}
        errorMessage={
          upiBlank
            ? "UPI ID is required for fund requests"
            : upiFormat
              ? "Enter a valid UPI ID (example: name@bank)"
              : ""
        } />}
    </div>
  </>
)


export const disasterType = [
  { key: "flood", label: "Flood" },
  { key: "earthquake", label: "EarthQuake" },
  { key: "wildfire", label: "WildFire" },
  { key: "drought", label: "Drought" },

]

export const requestType = [
  { key: "food", label: "Food" },
  { key: "shelter", label: "Shelter" },
  { key: "medical Aids", label: "Medical Aids" },
  { key: "funds", label: "Funds" },
  { key: "other", label: "Other" },
]
export const survivorType = [
  { key: "group", label: "Group" },
  { key: "individual", label: "Individual" },
]

const HelpDesk = () => {

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
    description: '',
    requestType: '',
    survivor: '',
    count: '',
    phone: '',
    upi: '',
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
  const { _id: userId, firstName } = useSelector((state) => state.user)
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

  const handleSelectChange = (name) => (keys) => {
    const selectedValue = Array.from(keys)[0];
    setSelectedDisaster(prev => ({ ...prev, [name]: selectedValue }));
  };

  const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

  const description = (selectedDisaster.description || "").trim();
  const phone = (selectedDisaster.phone || "").trim();
  const upi = (selectedDisaster.upi || "").trim();
  const descriptionValid = description.length >= 15;
  const phoneValid = phoneRegex.test(phone);             // also implies correct length
  const upiRequired = selectedDisaster.requestType === "funds";
  const upiValid = !upiRequired || (upi !== "" && upiRegex.test(upi));


  const isFormComplete =
    !!files.file1 &&
    !!files.file2 &&
    latitude !== "" &&
    longitude !== "" &&
    descriptionValid &&
    phoneValid &&
    (selectedDisaster.survivor === "group" ? selectedDisaster.count !== "" : true) &&
    upiValid &&
    Object.entries(selectedDisaster)
      .filter(([key]) =>
        key !== "latitude" &&
        key !== "longitude" &&
        key !== "file1" &&
        key !== "file2" &&
        key !== "count" &&
        key !== "upi" &&      // handled separately
        key !== "description" && // handled separately
        key !== "phone"          // handled separately
      )
      .every(([_, value]) => value !== "");

  const descriptionTooShort = description.length > 0 && description.length < 15;
  const phoneInvalid = phone.length > 0 && !phoneValid;
  const upiMissing = upiRequired && upi === "";
  const upiFormatInvalid = upi.length > 0 && !upiRegex.test(upi);
  const upiInvalid = upiMissing || upiFormatInvalid;



  const handleSubmit = async () => {
    setLoading(true);
    setDisable(true);
    try {
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
      if (selectedDisaster?.disasterType === 'flood') {
        const report = await dispatch(disasterEnquiry(formData, { req: 'enquiry' }));

        if (report.data.disasterType && report.data.description) {

          const helpRequest = await helpRequestSubmit([firstName, userId, report.data.requestType, report.data.riskLevel, report.data.severity, report.data.description, report.data.latitude, report.data.longitude, report.data.disasterType, report.data.ipfsUrl, report.data.phone, report.data.upi, report.data.survivor, report.data.count], address)

          if (helpRequest.status === 'success') {
            await dispatch(changeFeedBack({ status: true }))
          }
        }
        if (report.status == 200) {
          toast.success(report.data.message)
        } else {
          toast.error(report.data.message)
        }
      }

      if (selectedDisaster?.disasterType === 'wildfire') {
        const report = await dispatch(disasterEnquiry(formData, { req: 'fireEnquiry' }));

        if (report.data.disasterType && report.data.description) {

          const helpRequest = await helpRequestSubmit([firstName, userId, report.data.requestType, report.data.riskLevel, report.data.severity, report.data.description, report.data.latitude, report.data.longitude, report.data.disasterType, report.data.ipfsUrl, report.data.phone, report.data.upi, report.data.survivor, report.data.count], address)
          if (helpRequest.status === 'success') {
            await dispatch(changeFeedBack({ status: true }))
          }
        }
        if (report.status == 200) {
          toast.success(report.data.message)
        } else {
          toast.error(report.data.message)
        }
      }
      if (selectedDisaster?.disasterType === 'drought') {
        const report = await dispatch(disasterEnquiry(formData, { req: 'dryEnquiry' }));

        if (report.data.disasterType && report.data.description) {

          const helpRequest = await helpRequestSubmit([firstName, userId, report.data.requestType, report.data.riskLevel, report.data.severity, report.data.description, report.data.latitude, report.data.longitude, report.data.disasterType, report.data.ipfsUrl, report.data.phone, report.data.upi, report.data.survivor, report.data.count], address)
          if (helpRequest.status === 'success') {
            await dispatch(changeFeedBack({ status: true }))
          }
        }
        if (report.status == 200) {
          toast.success(report.data.message)
        } else {
          toast.error(report.data.message)
        }
      }
      if (selectedDisaster?.disasterType === 'earthquake') {
        const report = await dispatch(disasterEnquiry(formData, { req: 'shockEnquiry' }));

        if (report.data.disasterType && report.data.description) {

          const helpRequest = await helpRequestSubmit([firstName, userId, report.data.requestType, report.data.riskLevel, report.data.severity, report.data.description, report.data.latitude, report.data.longitude, report.data.disasterType, report.data.ipfsUrl, report.data.phone, report.data.upi, report.data.survivor, report.data.count], address)
          if (helpRequest.status === 'success') {
            await dispatch(changeFeedBack({ status: true }))
          }
        }
        if (report.status == 200) {
          toast.success(report.data.message)
        } else {
          toast.error(report.data.message)
        }
      }

    } catch (error) {
      console.log(error);
    } finally {
      setSelectedDisaster({
        disasterType: '',
        latitude: '',
        longitude: '',
        description: '',
        requestType: '',
        survivor: '',
        count: '',
        phone: '',
        upi: '',
        file1: null,
        file2: null
      });
      setLatitude('');
      setLongitude('');
      setUrl({ url1: null, url2: null });
      setFiles({
        file1: null,
        file2: null
      });
      fileInputRef.current.value = null;
      fileInputRef1.current.value = null;
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
        className=" flex flex-col items-center justify-center gap-4 w-full h-full mx-auto max-w-11xl p-2">
        <div className=' max-sm:text-3xl  md:text-4xl text 3xl:text-6xl font-semibold'>Help Desk</div>
        <Divider className='my-4' />
        <div className='flex max-sm:w-[90%] sm:w-[55%] items-center justify-center flex-col gap-2 '>
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
                          }`} size={40} />
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
            <Select className=' flex items-center justify-center ' selectedKeys={selectedDisaster.disasterType ? [selectedDisaster.disasterType] : []}
              onSelectionChange={handleSelectChange("disasterType")} label="Type of Disaster" isRequired variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' name="disasterType" isDisabled={disable}>

              {disasterType.map((calamity) => (
                <SelectItem key={calamity.key}>{calamity.label}</SelectItem>
              ))}
            </Select>

            <Select className=' flex items-center justify-center ' selectedKeys={selectedDisaster.requestType ? [selectedDisaster.requestType] : []}
              onSelectionChange={handleSelectChange("requestType")} label="Type of Request" isRequired variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' name="requestType" isDisabled={disable}>

              {requestType.map((request) => (
                <SelectItem key={request.key}>{request.label}</SelectItem>
              ))}
            </Select>

          </div>
          <div className='flex items-center justify-between w-full h-full gap-4'>
            <Select className={`flex items-center justify-center ${selectedDisaster.survivor === "group" ? "w-full" : "w-1/2"}`} selectedKeys={selectedDisaster.survivor ? [selectedDisaster.survivor] : []}
              onSelectionChange={handleSelectChange("survivor")} label="Survivors" isRequired variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' name="survivor" isDisabled={disable}>

              {survivorType.map((calamity) => (
                <SelectItem key={calamity.key}>{calamity.label}</SelectItem>
              ))}
            </Select>
            {selectedDisaster.survivor === "group" && <Input variant='flat' radius='sm' color='success' labelPlacement='outside' size='lg' label="Count" type="text" isRequired name="count" value={selectedDisaster.count} onChange={handleChange} isDisabled={disable} />}
          </div>
          {selectedDisaster?.disasterType === 'flood' && (
            <>
              <CommonFunction latitude={latitude} longitude={longitude} selectedDisaster={selectedDisaster} handleChange={handleChange} handleGeoClick={handleGeoClick} disabled={disable} descriptionError={descriptionTooShort} phoneError={phoneInvalid} upiError={upiInvalid} upiBlank={upiMissing} upiFormat={upiFormatInvalid} />
            </>
          )}
          {selectedDisaster?.disasterType === 'wildfire' && (

            <CommonFunction latitude={latitude} longitude={longitude} selectedDisaster={selectedDisaster} handleChange={handleChange} handleGeoClick={handleGeoClick} disabled={disable} descriptionError={descriptionTooShort} phoneError={phoneInvalid} upiError={upiInvalid} upiBlank={upiMissing} upiFormat={upiFormatInvalid} />
          )}
          {selectedDisaster?.disasterType === 'drought' && (
            <CommonFunction latitude={latitude} longitude={longitude} selectedDisaster={selectedDisaster} handleChange={handleChange} handleGeoClick={handleGeoClick} disabled={disable} descriptionError={descriptionTooShort} phoneError={phoneInvalid} upiError={upiInvalid} upiBlank={upiMissing} upiFormat={upiFormatInvalid} />
          )}
          {selectedDisaster?.disasterType === 'earthquake' && (
            <CommonFunction latitude={latitude} longitude={longitude} selectedDisaster={selectedDisaster} handleChange={handleChange} handleGeoClick={handleGeoClick} disabled={disable} descriptionError={descriptionTooShort} phoneError={phoneInvalid} upiError={upiInvalid} upiBlank={upiMissing} upiFormat={upiFormatInvalid} />
          )}

          <Button
            isLoading={loading}
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

export default HelpDesk