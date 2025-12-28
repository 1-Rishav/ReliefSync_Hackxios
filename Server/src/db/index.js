const mongoose = require("mongoose");

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connection Successful");
    } catch (error) {
        console.error("DB connection failed",error);
        process.exit(1);
    }
}
module.exports = connectDB;