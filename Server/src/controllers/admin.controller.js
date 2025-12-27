const Agent = require('../models/agent.model');
const NGO = require('../models/ngo.model');
const User = require('../models/auth.model')
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');

exports.getAllAgent = catchAsync(async (req,res,next)=>{
    try {
        const agent = await Agent.find();
        if(!agent){
            return res.status(401).json({message:"No agent found"});
        }else{

            return res.status(200).json({message:"Agent fetched successfully", agent});
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error, Try again later!"});
    }
})

exports.getAllNGO = catchAsync(async(req,res,next)=>{
    try {
        const ngo = await NGO.find();
        if(!ngo){
            return res.status(401).json({message:"No ngo found"});
        }else{
            return res.status(200).json({message:"NGO fetched successfully", ngo});
        }
    } catch (error) {
        return res.status(500).json({message:"Server error, Try again later!"});
    }
})

exports.verifyAgent = catchAsync(async(req,res,next)=>{
    const {agentId} = req.body;
    try {
        const agent = await Agent.findById(agentId);
        
        agent.is_verified=true;
        agent.save({validateBeforeSave:false});
    
        await User.findByIdAndUpdate(agent.userId , {agent_verified:true});
        
        return res.status(200).json({message:"Agent verified successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error, Try again later!"})
    }
})

exports.verifyNGO = catchAsync(async(req,res,next)=>{
    try {
        const {ngoId} = req.body;
        const ngo = await NGO.findById(ngoId);
        ngo.is_verified=true;
        ngo.save({validateBeforeSave:false});
    
        await User.findByIdAndUpdate(ngo.userId , {ngo_verified:true});
    
        return res.status(200).json({message:"NGO's verified successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error, Try again later!"})
    }
})
