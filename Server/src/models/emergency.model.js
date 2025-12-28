const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
    requesterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    agentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Agent",
        default:''
    },
    ngoId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ngo",
        default:''
    }
},{timestamps:true});

const Emergency = mongoose.model('Emergency', emergencySchema);

module.exports = Emergency;