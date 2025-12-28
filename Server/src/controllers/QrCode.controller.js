const qrCode=require("qrcode")
const jwt = require("jsonwebtoken")
const catchAsync = require("../utils/catchAsync")
const qrModel = require("../models/qrcode.model")
const crypto = require("crypto")

exports.createQr= catchAsync(async(req,res,next)=>{
    
    const { id,userId} = req.body;

    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2d' });
    const qrUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;
    const qrCodeUrl = await qrCode.toDataURL(qrUrl);

    await qrModel.create({ userId, id, qrCodeUrl, tokenHash: crypto.createHash("sha256").update(token).digest("hex") });

    return res.status(201).json({message:"Qr generated successfully"});
})

exports.getQr = catchAsync(async(req,res,next)=>{
    const userId=req.user._id;
    
    const { id } = req.body;
    const qrCode = await qrModel.findOne({ userId, id });
    if (!qrCode) {
        return res.status(404).json({ message: "No QR code found with this ID" });
    }
    return res.status(200).json({ qrCodeUrl:qrCode.qrCodeUrl });
})

exports.deleteQr = catchAsync(async(req,res,next)=>{
    const { id } = req.body;
    await qrModel.findByIdAndDelete(id);
    return res.status(204).json({message:"QR Code deleted successfully!"});
})