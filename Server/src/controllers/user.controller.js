const User = require('../models/auth.model');
const Feedback = require('../models/feedback.model');
const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const NGO = require('../models/ngo.model');
const Agent = require('../models/agent.model');
const Ngo = require('../models/ngo.model');
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getUser = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).select('+password')
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Unauthorized access" })
    }
})

exports.changeProfile = catchAsync(async (req, res, next) => {
    const profile = req.file;
    const userId = req.user._id;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // ✅ 1. Delete old image from Cloudinary if it exists
        if (user.profilePublicId) {
            await cloudinary.uploader.destroy(user.profilePublicId);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            //resource_type: 'raw', // only for files 
            folder: 'ReliefSync_profile',
            use_filename: true,   // Use the original filename
            unique_filename: false,
            access_mode: 'public',

        });

        const file = result.secure_url;
        const publicId = result.public_id;
        const updateProfile = await User.findByIdAndUpdate(userId, { profile: file, profilePublicId: publicId }, { new: true });

        return res.status(200).json({ message: "Profile changed successfully", updatedFields: updateProfile });
    } catch (error) {
        return res.status(500).json({ message: "Unauthorized access" });
    }
})

exports.changeName = catchAsync(async (req, res, next) => {
    const { firstName, lastName } = req.body;
    const userId = req.user._id;

    try {
        const updateData = {};
        if (firstName) {
            updateData.firstName = firstName;
        }
        if (lastName) {
            updateData.lastName = lastName;
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        return res.status(200).json({
            message: "User updated successfully",
            updatedFields: updatedUser,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json("Unauthorized access");
    }
})

exports.changeEmailOrPass = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const userId = req.user._id;
    try {
        const updateData = {};

        if (email) {
            updateData.email = email;
        }

        if (password) {
            const hashedPassword = await User.hashPassword(password);
            updateData.password = hashedPassword;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        return res.status(200).json({
            message: "User updated successfully",
            updatedFields: updatedUser,
        });

    } catch (error) {
        return res.status(500).json("Unauthorized access");
    }
})

exports.toggleHelp = catchAsync(async (req, res, next) => {
    const { helpEnabled } = req.body;
    const userId = req.user._id;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { help: Boolean(helpEnabled) }, { new: true });
        return res.status(200).json({ updatedFields: updatedUser });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Unauthorized access", error });
    }
})

exports.removeAccount = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    if (!userId) {
        return res.status(404).json({ message: "User not found" });
    }
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Unauthorized access" });
    }
})

exports.toggleFeedback = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const userId = req.user._id;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { feedback: Boolean(status) }, { new: true });
        return res.status(200).json({ updatedFields: updatedUser });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Unauthorized access", error });
    }
})

exports.feedBackEntry = catchAsync(async (req, res, next) => {
    const { disasterType, feedBack, deliveredId } = req.body;
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const name = user.firstName;
        const profile = user.profile;

        const agentRole = await User.findById(deliveredId);
        if (!agentRole) {
            return res.status(404).json({ message: "Delivered agency not found" });
        }
        const organizationRole = agentRole.role;
        const agency =
            (await NGO.findOne({ userId: deliveredId })) ||
            (await Agent.findOne({ userId: deliveredId }));

        if (!agency) {
            return res.status(404).json({ message: "Agency not found in NGO or Agent model" });
        }
        const organization = agency.ngo_Name || agency.name;
        const feedback = await Feedback.create({
            name,
            profile,
            disasterType,
            feedBack,
            organizationRole,
            organization
        });
        return res.status(200).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error submitting feedback", error });
    }
})

exports.UnverifiedNGOCount = catchAsync(async (req, res, next) => {
    try {
        const unverifiedNGOs = await User.find({ role:'ngo',ngo_verified: false });
        return res.status(200).json({ unverifiedNGOs: unverifiedNGOs.length });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching unverified NGOs", error });
    }
});
exports.UnverifiedAgentCount = catchAsync(async (req, res, next) => {
    try {
        const unverifiedAgents = await User.find({ role:'gov_Agent',agent_verified: false });
        return res.status(200).json({ unverifiedAgents: unverifiedAgents.length });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching unverified Agents", error });
    }
})

exports.getAllFeedbacks = catchAsync(async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        return res.status(200).json({ feedbacks });
    } catch (error) {
        
        return res.status(500).json({ message: "Error fetching feedbacks", error });
    }
})

exports.toggleAgencyStatus = catchAsync(async (req, res, next) => {
    const reqId=req.user._id;
    const {userId} = req.body;
    try {
        const agencyStatus = await Agent.findOneAndUpdate({_id:userId},{$set:{status: true, emergency:true}},{new:true});
        if(agencyStatus){
        await Emergency.create({requesterId:reqId,agentId:userId});
        }
        if(!agencyStatus){
            const ngoStatus = await Ngo.findOneAndUpdate({_id:userId},{$set:{status: true, emergency:true}},{new:true});
            if(ngoStatus){
            await Emergency.create({requesterId:reqId,ngoId:userId});
            }
            if(!ngoStatus){
                return res.status(404).json({message:"Agency not found"});
            }
            return res.status(200).json({message:"Status updated"});
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

exports.toggleEmergencyStatus = catchAsync(async (req, res, next) => {
    const userId=req.user._id;
    try {
        const agencyStatus = await Agent.findOneAndUpdate({userId:userId},{$set:{emergency:false}},{new:true});
        if(agencyStatus){
            const requesterId = await Emergency.findOne({agentId:userId}).select('requesterId -_id');
            const updateAllocationConfirm = await User.findByIdAndUpdate(requesterId.requesterId, { allocationConfirm: true }, { new: true });
            return res.status(200).json({message:"Emergency status updated", updatedFields:updateAllocationConfirm});
        }
        if(!agencyStatus){
            const ngoStatus = await Ngo.findOneAndUpdate({userId:userId},{$set:{emergency:false}},{new:true});
            if(!ngoStatus){
                return res.status(404).json({message:"Agency not found"});
            }
            if(ngoStatus){
                const requesterId = await Emergency.findOne({ngoId:userId}).select('requesterId -_id');
                const updateAllocationConfirm = await User.findByIdAndUpdate(requesterId.requesterId, { allocationConfirm: true }, { new: true });
                return res.status(200).json({message:"Emergency status updated", updatedFields:updateAllocationConfirm});
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server error" });
    }
});

exports.resetAllocationAndStatus=catchAsync(async(req,res,next)=>{
    const userId=req.user._id;
    try {
        const resetAllocationConfirm = await User.findByIdAndUpdate(userId, { allocationConfirm: false }, { new: true });
        const findAgent = await Emergency.findOne({requesterId:userId}).select('agentId -_id');
        if(findAgent.agentId!=''){
            await Agent.findByIdAndUpdate(findAgent.agentId, { status: false }, { new: true });
            return res.status(200).json({message:"Allocation and status updated", updatedFields:resetAllocationConfirm});
        }else if(findAgent==''){
            const findNgo = await Emergency.findOne({requesterId:userId}).select('ngoId -_id');
            await Ngo.findByIdAndUpdate(findNgo.ngoId, { status: false }, { new: true });
            return res.status(200).json({message:"Allocation and status updated", updatedFields:resetAllocationConfirm});
        }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

exports.resetAllocationOnly=catchAsync(async(req,res,next)=>{
    const userId=req.user._id;
    try {
        const resetAllocationConfirm = await User.findByIdAndUpdate(userId, { allocationConfirm: false }, { new: true });
        return res.status(200).json({message:"Allocation updated", updatedFields:resetAllocationConfirm});
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});