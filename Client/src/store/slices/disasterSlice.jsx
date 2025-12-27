import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';

const initialState = {
    file1:null,
    file2:null,
}

const disasterSlice = createSlice({
    name:'disasterReport',
    initialState,
    reducers:{
        imageUpload(state ,action){
            if(action.payload.file1 !== undefined){
                state.file1 = action.payload.file1;
            };
            if(action.payload.file2 !== undefined ){
                state.file2 = action.payload.file2;
            }
        }
    }
})

const disasterAction = disasterSlice.actions;
export default disasterSlice.reducer;

export function tempImage(formValues,{req}){
return async(dispatch , _)=>{
    try {
        const response = await axios.post(`disasterReport/${req}`,formValues,{withCredentials:true,headers:{'Content-Type':'multipart/form-data'}})
        
        const {message , ipfsUrl}=response.data;
        if(req === 'uploadTempImage1'){
            dispatch(disasterAction.imageUpload({file1:ipfsUrl}))
        }else{
            dispatch(disasterAction.imageUpload({file2:ipfsUrl}))
        }
        return ipfsUrl;
    } catch (error) {
        toast.error(error.message);
    }
}
}

const deleteTempImage = (formValues,{req})=>{
    return async(dispatch , _)=>{
        try {
            const response = await axios.post(`disasterReport/${req}` , formValues , {withCredentials:true});
            if(req === 'deleteTempImage1'){
            dispatch(disasterAction.imageUpload({file1:null}))
        }else{
            dispatch(disasterAction.imageUpload({file2:null}))
        }
        } catch (error) {
            toast.error(error.message);
        }
    }
}

const disasterEnquiry = (formValues,{req})=>{
    return async()=>{
        try {
            const response = await axios.post(`disasterReport/${req}`,formValues,{withCredentials:true , headers:{'Content-Type':'multipart/form-data'}})
             
             return response;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

const predictedData = ({req})=>{
    return async()=>{
        try {
            const response = await axios.get(`weather/${req}`,{withCredentials:true})
            return response
        } catch (error) {
            console.log(error);
        }
    }
}

const areaReport = (formValues)=>{
    return async()=>{
        try {
            const response = await axios.post('disasterReport/areaEnquiry',formValues,{withCredentials:true})
            toast.success(response?.data?.message)
            return response;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

const precautionDetail = (formValues)=>{
    return async()=>{
        try {
            const response = await axios.post('disasterReport/precaution',formValues,{withCredentials:true})
            return response;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

const getAreaReport = ()=>{
    return async()=>{
        try {
            const response = await axios.get('disasterReport/getAreaDisaster',{withCredentials:true});
            return response;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

const createQrCode = (formValues)=>{

    return async()=>{
        try {
            const response = await axios.post('qrcode/create',formValues,{withCredentials:true })
             
             return response;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

const getQrCode = (formValues)=>{
    return async()=>{
        try {
            const response = await axios.post('qrcode/get',formValues,{withCredentials:true})
             
             return response;
        } catch (error) {
            error
            //toast.error(error?.message);
        }
    }
}

const deleteQrCode = (formValues)=>{
    return async()=>{
        try {
            const response = await axios.post('qrcode/delete',formValues,{withCredentials:true , headers:{'Content-Type':'multipart/form-data'}})
             
             return response;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

const sosRequest = (formValues)=>{
    return async()=>{
        try {
            const response = await axios.post('disasterReport/sosAlert',formValues,{withCredentials:true})
            return response;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

const sendUrgentMail = (formValues)=>{
    console.log(formValues);
    return async()=>{
        try {
            const response = await axios.post('disasterReport/urgencyMail',formValues,{withCredentials:true , headers:{'Content-Type':'multipart/form-data'}})
            return response;
        } catch (error) {
            toast.error(error?.message);
        }
    }
}

export {deleteTempImage,disasterEnquiry,createQrCode,getQrCode,deleteQrCode,getAreaReport,areaReport,precautionDetail,predictedData,sosRequest,sendUrgentMail};


