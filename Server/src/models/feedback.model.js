const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    profile:{
        type:String,
        required:true
    },
    disasterType:{
        type:String,
        required:true
    },
    feedBack:{
        type:String,
        required:true
    },
    organizationRole:{
        type:String,
        required:true
    },
    organization:{
        type:String,
        required:true
    }
},{timestamps:true});

const Feedback =new mongoose.model('Feedback',feedbackSchema);

module.exports=Feedback;