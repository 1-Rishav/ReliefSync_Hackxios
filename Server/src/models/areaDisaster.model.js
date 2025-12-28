const mongoose = require('mongoose');

const areaDisasterSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    disasterType:{
        type:String,
        required:true
    },
    riskLevel:{
        type:Number,
        required:true
    },
    severity:{
        type:String,
        required:true
    }
},{timestamps:true});

const AreaDisaster = new mongoose.model('AreaDisaster',areaDisasterSchema);

module.exports = AreaDisaster;