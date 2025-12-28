const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    id:{
        type:Number,
        required:true
    },
    qrCodeUrl: {
        type: String,
        required: true
    },
    tokenHash:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '2d'
    }
})

module.exports = mongoose.model("QrCode", qrCodeSchema);