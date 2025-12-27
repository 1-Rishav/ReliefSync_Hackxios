const { Error } = require("mongoose");
const Agent = require("../models/agent.model");
const User = require("../models/auth.model");
const catchAsync = require("../utils/catchAsync");
const filterObj = require("../utils/filterObj");
const {uploadToPinata} = require('../Helper/uploadPinata')

exports.agentEntry = catchAsync(async(req,res, next)=>{
    const {official_id , department , badge_number , current_state, office_location} = req.body;
    const userId = req.user._id;
    const filePath = req.file.path;
    const ipfsUrl = await uploadToPinata(filePath);
    const filteredBody = filterObj(req.body, 'official_id', 'department', 'badge_number', 'current_state', 'office_location');
    filteredBody.official_id=ipfsUrl;
    try {
        const badge = await Agent.findOne({badge_number});
        if(badge){
            return res.status(401).json({message:"Agent already exists, Try login!"});
        }
        const user = await User.findById(userId);
        const name = user.firstName;
        const email = user.email;
        const agentEntry = await Agent.create({userId ,name , email , ...filteredBody});
        const agentExist = await User.findByIdAndUpdate(userId , {agentExist:true},{new:true});
        
        const AgentExist = agentExist.agentExist;
        const agent_verified = agentExist.agent_verified;
        const verified = agentExist.verified;
        const role = agentExist.role;
        const token = agentExist.generateAuthToken();
        return res.status(200).json({message:"Agent registered successfully, verification under process!",AgentExist,token,role,agent_verified,verified});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error, Please try again later!"});
    }
})

exports.getAgentDetails = catchAsync(async(req,res,next)=>{
    const userId = req.user._id;
    try {
        const agentDetails = await Agent.findOne({userId});
        if(!agentDetails){
            return res.status(404).json({message:"Agent not found!"});
        }
        return res.status(200).json({message:"Agent details fetched successfully!",data:agentDetails});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server Error, Please try again later!"});
    }
})

exports.getAllAgent = catchAsync(async (req,res,next)=>{
    try {
        const agent = await Agent.find({is_verified:true});
        return res.status(200).json({data:agent});
    } catch (error) {
        return res.status(500).json({message:"Server Error, Please try again later!"})
    }
})

exports.agentToggleStatus = catchAsync(async(req,res,next)=>{
const userId = req.user._id;
const agentDetails = await Agent.findOne({userId});
if(!agentDetails){
    return res.status(404).json({message:"Agent not found"});  
}
agentDetails.status = !agentDetails.status;
await agentDetails.save();
return res.status(200).json({message:"Agent status updated successfully!"});
})