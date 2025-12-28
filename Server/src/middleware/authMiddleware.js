const catchAsync = require("../utils/catchAsync")
const Blacklist = require("../models/tokenBlackList.model")
const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");

exports.authUser = catchAsync(async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    
    try {
        const isBlacklisted = await Blacklist.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodeToken._id);
        req.user = user;
        if(!req.user){
            return res.status(401).json();
        }
        next();
    } catch (error) {
        
        return res.status(500).json({ message: "Server error! Try again later" });
    }
})