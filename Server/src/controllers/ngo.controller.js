const NGO = require('../models/ngo.model');
const User = require('../models/auth.model')
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const {uploadToPinata} = require('../Helper/uploadPinata')

exports.ngoEntry = catchAsync(async(req,res,next)=>{
    const {ngo_Name , registrationNumber , registrationType, stateORcity, registeredAddress, officialEmail, phone, founderName, website, media_link,Official_docs} = req.body;
    const filteredBody = filterObj(req.body , 'ngo_Name' , 'registrationNumber' , 'registrationType', 'stateORcity' , 'registeredAddress' , 'officialEmail' , 'phone' , 'founderName' , 'website' , 'media_link','Official_docs' );
    const userId = req.user._id;
    
    const filePath = req.file.path;
    console.log("File path:", filePath); // Debugging line
    const ipfsUrl = await uploadToPinata(filePath)
    filteredBody.Official_docs=ipfsUrl;
    try {
    const name = await NGO.findOne({ngo_Name});
    if(name){
        return res.status(401).json({message:"NGO with this name already exists,"});
    }
    const registeredNumber = await NGO.findOne({registrationNumber});
    if(registeredNumber){
        return res.status(401).json({message:"This NGO already exists, Try login!"});
    }
    const email = await NGO.findOne({officialEmail});
    if(email){
        return res.status(401).json({message:"This NGO already exists, Try login!"});
    }
    const ngoEntry = await NGO.create({userId , ...filteredBody});
    const ngoExist = await User.findByIdAndUpdate(userId,{ngoExist:true},{new:true});
    const NgoExist = ngoExist.ngoExist;
    const ngo_verified = ngoExist.ngo_verified;
    const role = ngoExist.role;
    const verified = ngoExist.verified;
    const token = ngoExist.generateAuthToken()
    return res.status(200).json({message:"NGO registered successfully, verification under process!",NgoExist,token,role,ngo_verified,verified})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error, Please try again later!"})
    }
})

exports.getNgoDetails = catchAsync(async(req,res,next)=>{
    const userId = req.user._id;
    const ngoDetails = await NGO.findOne({userId});
    if(!ngoDetails){
        return res.status(404).json({message:"NGO not found"});
    }
    return res.status(200).json({message:"NGO details fetched successfully",data:ngoDetails});
})

exports.getAllNGO = catchAsync(async(req,res,next)=>{
    try {
        const ngo = await NGO.find({is_verified:true});
        return res.status(200).json({data:ngo});
    } catch (error) {
        return res.status(500).json({message:"Server Error, Please try again later!"})
    }
})

exports.ngoToggleStatus = catchAsync(async(req,res,next)=>{
const userId = req.user._id;
const ngoDetails = await NGO.findOne({userId});
if(!ngoDetails){
    return res.status(404).json({message:"NGO not found"});
}
ngoDetails.status = !ngoDetails.status;
await ngoDetails.save();
return res.status(200).json({message:"NGO status updated successfully!"});
})