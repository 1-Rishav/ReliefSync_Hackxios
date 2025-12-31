const catchAsync = require('../utils/catchAsync');
const filterObj = require('../utils/filterObj');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const OpenAI = require('openai');
const { uploadToPinata, deleteFromPinata } = require('../Helper/uploadPinata')
const { getDisasterData } = require('../Helper/fetchFloodReport');
const { predictFloodDamage, predictFlood, predictWildFire, predictDrought, predictEarthquake } = require('../Helper/disasterAPIs');
const AreaDisaster = require('../models/areaDisaster.model');
const { CronJob } = require('cron');
const User = require('../models/auth.model');
const { convertWebmToMp3 } = require('../Helper/audioConverter');
const { agenticEmergency, pushToRoles } = require('./notification.controller');
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadTempImage = catchAsync(async (req, res, next) => {
  const filePath = req.file.path;
  const ipfsUrl = await uploadToPinata(filePath);
  return res.status(200).json({ message: "Image uploaded", ipfsUrl });
})

exports.deleteTempImage = catchAsync(async (req, res, next) => {
  const { file } = req.body;
  const hash = await file.split("/").pop();

  const deleteFile = await deleteFromPinata(hash);
  return res.status(200).json({ message: "File deleted" })
})

exports.disasterEnquiry = catchAsync(async (req, res, next) => {
  const { disasterType, latitude, longitude, duration, survivor, description = '', requestType = '', phone = '', upi = '', count = 1 } = req.body;
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" })
  }

  const user = await User.findById(userId);

  if (user.helpRequestLimit <= 0) {
    return res.status(403).json({ message: "You have reached your help request limit." })
  }

  const phoneRaw = phone ?? "";
  const phoneStr = String(phoneRaw).trim();

  if (phoneStr) {
    // Option A: Indian mobiles
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    const cleaned = phoneStr.replace(/[^\d+]/g, ""); // keep digits and leading '+'
    if (!phoneRegex.test(cleaned)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
  }

  const upiRaw = upi ?? "";
  const upiStr = String(upiRaw).trim();

  if (upiStr) {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

    if (!upiRegex.test(upi)) {
      return res.status(400).json({ message: "Invalid UPI ID format" });
    }
  }

  const path1 = req.files['file1']?.[0].path;
  const path2 = req.files['file2']?.[0].path;
  if (!path1 || !path2) {
    return res.status(401).json({ message: 'Valid image is required to identify' })
  }

  const ipfsUrl = await uploadToPinata(path1);
  try {
    const { rainfall_mm, elevation_m, slope_deg, distance_to_water_m } = await getDisasterData(parseFloat(Number(latitude)), parseFloat(Number(longitude)));

    const payload = {
      features: [
        Number(latitude),
        Number(longitude),
        Number(1000000),
        Number(240),
        Number(10),
        Number(distance_to_water_m)
      ]
    };
    //console.log(payload)
    const predictedData = await predictFlood({ ...payload });
    if (predictedData === 1) {
      const predictedDamageData = await predictFloodDamage({ ...payload })
      //console.log(predictedDamageData)
      let severity;
      if (predictedDamageData === 1) {
        severity = 'Low';
      } else if (predictedDamageData === 2) {
        severity = 'High';
      }
      if (description.trim() !== '' && requestType.trim() !== '') {
        await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } })
        await pushToRoles({
          roles: ["ngo", "gov_Agent", "admin"],
          pushType: "REQUESTER",
          excludeUserId: userId,
          data: {
            disasterType,
            riskLevel: predictedDamageData,
            requestType,
            survivor,
            count,
            description,
          }
        });
        return res.status(200).json({ message: "Report submitted successfully", disasterType, latitude, longitude, ipfsUrl, riskLevel: predictedDamageData, severity, duration, description, requestType, phone, upi, survivor, count })
      } else {
        await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } })
        await pushToRoles({
          roles: ["ngo", "gov_Agent", "admin"],
          pushType: "REPORTER",
          excludeUserId: userId,
          data: {
            disasterType,
            riskLevel: predictedDamageData,
            severity,
            duration,
          }
        });
        return res.status(200).json({ message: "Report submitted successfully", disasterType, latitude, longitude, ipfsUrl, riskLevel: predictedDamageData, severity, duration })
      }
    } else {
      return res.status(200).json({ message: "Sorry we did not find any flood risk" })
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Some error occured try again later!' });
  }
})

exports.wildFireEnquiry = catchAsync(async (req, res, next) => {
  const { disasterType, latitude, longitude, duration, survivor, description = '', requestType = '', phone = '', upi = '', count = 1 } = req.body;
  const userId = req.user._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" })
  }

  const user = await User.findById(userId);

  if (user.helpRequestLimit <= 0) {
    return res.status(403).json({ message: "You have reached your help request limit." })
  }

  const phoneRaw = phone ?? "";
  const phoneStr = String(phoneRaw).trim();

  if (phoneStr) {
    // Option A: Indian mobiles
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    const cleaned = phoneStr.replace(/[^\d+]/g, ""); // keep digits and leading '+'
    if (!phoneRegex.test(cleaned)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
  }

  const upiRaw = upi ?? "";
  const upiStr = String(upiRaw).trim();

  if (upiStr) {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

    if (!upiRegex.test(upi)) {
      return res.status(400).json({ message: "Invalid UPI ID format" });
    }
  }

  const path1 = req.files['file1']?.[0].path;
  const path2 = req.files['file2']?.[0].path;
  if (!path1 || !path2) {
    return res.status(401).json({ message: 'Valid image is required to identify' })
  }

  const ipfsUrl = await uploadToPinata(path1);
  try {
    const payload = {
      lat: Number(latitude),
      lon: Number(longitude),
      date: new Date().toISOString().split('T')[0]
    }
    const predictFireData = await predictWildFire({ ...payload });
    console.log(predictFireData)
    if (predictFireData.occurrence === 1) {
      let severity;
      if (predictFireData.severity === 1) {
        severity = 'Low';
      } else if (predictFireData.severity === 2) {
        severity = 'High';
      }
      if (description.trim() !== '' && requestType.trim() !== '') {
        await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } })
        await pushToRoles({
          roles: ["ngo", "gov_Agent", "admin"],
          pushType: "REQUESTER",
          excludeUserId: userId,
          data: {
            disasterType,
            riskLevel: predictedDamageData,
            requestType,
            survivor,
            count,
            description,
          }
        });
        return res.status(200).json({ message: "Report submitted successfully", disasterType, latitude, longitude, ipfsUrl, riskLevel: predictFireData.severity, severity, duration, description, requestType, phone, upi, survivor, count })
      } else {
        await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } })
        await pushToRoles({
          roles: ["ngo", "gov_Agent", "admin"],
          pushType: "REQUESTER",
          excludeUserId: userId,
          data: {
            disasterType,
            riskLevel: predictedDamageData,
            severity,
            duration,
          }
        });
        return res.status(200).json({ message: "Report submitted successfully", disasterType, latitude, longitude, ipfsUrl, riskLevel: predictFireData.severity, severity, duration })
      }
    } else {
      return res.status(200).json({ message: "Sorry we did not find any wildfire risk" })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Some error occured try again later!' });
  }
})

exports.droughtEnquiry = catchAsync(async (req, res, next) => {
  const { disasterType, latitude, longitude, duration, survivor, description = '', requestType = '', phone = '', upi = '', count = 1 } = req.body;
  const userId = req.user._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" })
  }
  const user = await User.findById(userId);
  if (user.helpRequestLimit <= 0) {
    return res.status(403).json({ message: "You have reached your help request limit." })
  }

  const phoneRaw = phone ?? "";
  const phoneStr = String(phoneRaw).trim();

  if (phoneStr) {
    // Option A: Indian mobiles
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    const cleaned = phoneStr.replace(/[^\d+]/g, ""); // keep digits and leading '+'
    if (!phoneRegex.test(cleaned)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
  }

  const upiRaw = upi ?? "";
  const upiStr = String(upiRaw).trim();

  if (upiStr) {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

    if (!upiRegex.test(upi)) {
      return res.status(400).json({ message: "Invalid UPI ID format" });
    }
  }

  const path1 = req.files['file1']?.[0].path;
  const path2 = req.files['file2']?.[0].path;
  if (!path1 || !path2) {
    return res.status(401).json({ message: 'Valid image is required to identify' })
  }

  const ipfsUrl = await uploadToPinata(path1);
  try {
    const payload = {
      lat: Number(latitude),
      lon: Number(longitude),
      time: new Date().getFullYear().toString()
    }
    const predictDry = await predictDrought({ ...payload });

    if (predictDry.occurrence === 1) {
      let severity;
      if (predictDry.severity === 1) {
        severity = 'Low';
      } else if (predictDry.severity === 2) {
        severity = 'High';
      }
      if (description.trim() !== '' && requestType.trim() !== '') {
        await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } })
        await pushToRoles({
          roles: ["ngo", "gov_Agent", "admin"],
          pushType: "REQUESTER",
          excludeUserId: userId,
          data: {
            disasterType,
            riskLevel: predictedDamageData,
            requestType,
            survivor,
            count,
            description,
          }
        });
        return res.status(200).json({ message: "Report submitted successfully", disasterType, latitude, longitude, ipfsUrl, riskLevel: predictDry.severity, severity, duration, description, requestType, phone, upi, survivor, count })
      } else {
        await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } })
        await pushToRoles({
          roles: ["ngo", "gov_Agent", "admin"],
          pushType: "REPORTER",
          excludeUserId: userId,
          data: {
            disasterType,
            riskLevel: predictedDamageData,
            severity,
            duration,
          }
        });
        return res.status(200).json({ message: "Report submitted successfully", disasterType, latitude, longitude, ipfsUrl, riskLevel: predictDry.severity, severity, duration })
      }
    } else {
      return res.status(200).json({ message: "Sorry we did not find any drought risk" })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Some error occured try again later!' });
  }
})

exports.earthquakeEnquiry = catchAsync(async (req, res, next) => {
  const { disasterType, latitude, longitude, duration, survivor, description = '', requestType = '', phone = '', upi = '', count = 1 } = req.body;
  const userId = req.user._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" })
  }
  const user = await User.findById(userId);
  if (user.helpRequestLimit <= 0) {
    return res.status(403).json({ message: "You have reached your help request limit." })
  }

  const phoneRaw = phone ?? "";
  const phoneStr = String(phoneRaw).trim();

  if (phoneStr) {
    // Option A: Indian mobiles
    const phoneRegex = /^(?:\+91|0)?[6-9]\d{9}$/;
    const cleaned = phoneStr.replace(/[^\d+]/g, ""); // keep digits and leading '+'
    if (!phoneRegex.test(cleaned)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }
  }

  const upiRaw = upi ?? "";
  const upiStr = String(upiRaw).trim();

  if (upiStr) {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;

    if (!upiRegex.test(upi)) {
      return res.status(400).json({ message: "Invalid UPI ID format" });
    }
  }

  const path1 = req.files['file1']?.[0].path;
  const path2 = req.files['file2']?.[0].path;
  if (!path1 || !path2) {
    return res.status(401).json({ message: 'Valid image is required to identify' })
  }

  const ipfsUrl = await uploadToPinata(path1);
  try {
    const payload = {
      lat: Number(latitude),
      lon: Number(longitude),
      time: new Date().toISOString().split('T')[0]
    }
    const predictShock = await predictEarthquake({ ...payload });
    if (predictShock.occurrence === 1) {
      let severity;
      if (predictShock.severity === 1) {
        severity = 'Low';
      } else if (predictShock.severity === 2) {
        severity = 'High';
      }
      if (description.trim() !== '' && requestType.trim() !== '') {
        await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } })
        await pushToRoles({
          roles: ["ngo", "gov_Agent", "admin"],
          pushType: "REQUESTER",
          excludeUserId: userId,
          data: {
            disasterType,
            riskLevel: predictedDamageData,
            requestType,
            survivor,
            count,
            description,
          }
        });
        return res.status(200).json({ message: "Report submitted successfully", disasterType, latitude, longitude, ipfsUrl, riskLevel: predictShock.severity, severity, duration, description, requestType, phone, upi, survivor, count })
      } else {
        await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } })
        await pushToRoles({
          roles: ["ngo", "gov_Agent", "admin"],
          pushType: "REPORTER",
          excludeUserId: userId,
          data: {
            disasterType,
            riskLevel: predictedDamageData,
            severity,
            duration,
          }
        });
        return res.status(200).json({ message: "Report submitted successfully", disasterType, latitude, longitude, ipfsUrl, riskLevel: predictShock.severity, severity, duration })
      }
    } else {
      return res.status(200).json({ message: "Sorry we did not find any earthquake risk" })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Some error occured try again later!' });
  }
});

exports.areaEnquiry = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { latitude, longitude } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" })
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  try {
    const { rainfall_mm, elevation_m, slope_deg, distance_to_water_m } = await getDisasterData(parseFloat(Number(latitude)), parseFloat(Number(longitude)));

    const payload = {
      features: [
        Number(latitude),
        Number(longitude),
        Number(rainfall_mm),
        Number(elevation_m),
        Number(slope_deg),
        Number(distance_to_water_m)
      ]
    };
    const wildfirePayload = {
      lat: Number(latitude),
      lon: Number(longitude),
      date: new Date().toISOString().split('T')[0]
    }

    const droughtPayload = {
      lat: Number(latitude),
      lon: Number(longitude),
      time: new Date().getFullYear().toString()
    }

    const earthQuakePayload = {
      lat: Number(latitude),
      lon: Number(longitude),
      time: new Date().toISOString().split('T')[0]
    }

    const result = [];

    const predictedData = await predictFlood({ ...payload });
    console.log(predictedData)
    if (predictedData === 1) {
      const predictedDamageData = await predictFloodDamage({ ...payload })
      let severity='Low';
      if (predictedDamageData === 1) {
        severity = 'Low';
      } else if (predictedDamageData === 2) {
        severity = 'High';
      }

      const areaDisaster = new AreaDisaster({
        userId,
        disasterType: 'Flood',
        riskLevel: predictedDamageData,
        severity
      });
      await areaDisaster.save();

      result.push({ disasterType: 'Flood', riskLevel: predictedDamageData, severity })
    }
    const predictFireData = await predictWildFire({ ...wildfirePayload });
    if (predictFireData.occurrence === 1) {
      let severity='Low';
      if (predictFireData.severity === 1) {
        severity = 'Low';
      } else if (predictFireData.severity === 2) {
        severity = 'High';
      }
      const areaDisaster = new AreaDisaster({
        userId,
        disasterType: 'Wildfire',
        riskLevel: predictFireData.severity,
        severity
      })
      await areaDisaster.save();

      result.push({ disasterType: 'Wildfire', riskLevel: predictFireData.severity, severity })
    }
    const predictDry = await predictDrought({ ...droughtPayload });
    if (predictDry.occurrence === 1) {
      let severity='Low';
      if (predictDry.severity === 1) {
        severity = 'Low';
      } else if (predictDry.severity === 2) {
        severity = 'High';
      }
      const areaDisaster = new AreaDisaster({
        userId,
        disasterType: 'Drought',
        riskLevel: predictDry.severity,
        severity
      })
      await areaDisaster.save();

      result.push({ disasterType: 'Drought', riskLevel: predictDry.severity, severity })
    }
    const predictShock = await predictEarthquake({ ...earthQuakePayload });
    if (predictShock.occurrence === 1) {
      let severity='Low';
      if (predictShock.severity === 1) {
        severity = 'Low';
      } else if (predictShock.severity === 2) {
        severity = 'High';
      }
      const areaDisaster = new AreaDisaster({
        userId,
        disasterType: 'Earthquake',
        riskLevel: predictShock.severity,
        severity
      })
      await areaDisaster.save();

      result.push({ disasterType: 'Earthquake', riskLevel: predictShock.severity, severity })
    }

    if (result.length > 0) {
      await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } });
      return res.status(200).json({ message: "Disaster(s) found in your area", result })
    }
    else {
      return res.status(200).json({ message: "Currently your area is safe!" })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Some error occured try again later!' });
  }
})

exports.getAreaDisaster = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  try {
    const areaDisaster = await AreaDisaster.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ areaDisaster })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Some error occured try again later!' });
  }
})

exports.GenAIPrecaution = catchAsync(async (req, res, next) => {
  const { disasterType, riskLevel, severity } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (user.requestLimit <= 0) {
      return res.status(403).json({ message: "You have reached your request limit for today." })
    }
    const client = new OpenAI({
      apiKey: process.env.GROQ_API,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await client.responses.create({
      model: "groq/compound",
      input: `What are the safety precautions to be taken during ${disasterType} with risk level ${riskLevel} and severity ${severity}? Provide the precautions in bullet points.`,
    });
    await User.findByIdAndUpdate(userId, { $inc: { requestLimit: -1 } });
    return res.status(200).json(response.output_text);
  } catch (error) {
    console.error("Error generating AI precautions:", error);
    return res.status(500).json({ message: 'Error generating AI precautions' });
  }
});

const resetLimit = new CronJob(
  "0 0 0 * * *",                 // every day at midnight
  async () => {
    try {
      console.log("⏰ Resetting user request limits...");
      await User.updateMany({}, { requestLimit: 3 });
    } catch (error) {
      console.error("Error resetting user request limits:", error);
    }
  },
  null,                          // onComplete (optional)
  true                           // <-- start automatically
);

exports.sosEmergency = catchAsync(async (req, res, next) => {
  const { latitude, longitude } = req.body;

  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" })
  }

  try {
    const user = await User.findById(userId);
    if (user.helpRequestLimit <= 0) {
      return res.status(403).json({ message: "You have reached your SOS request limit." })
    }
    const { rainfall_mm, elevation_m, slope_deg, distance_to_water_m } = await getDisasterData(parseFloat(Number(latitude)), parseFloat(Number(longitude)));

    const payload = {
      features: [
        Number(latitude),
        Number(longitude),
        Number(rainfall_mm),
        Number(elevation_m),
        Number(slope_deg),
        Number(distance_to_water_m)
      ]
    };
    const wildfirePayload = {
      lat: Number(latitude),
      lon: Number(longitude),
      date: new Date().toISOString().split('T')[0]
    }

    const droughtPayload = {
      lat: Number(latitude),
      lon: Number(longitude),
      time: new Date().getFullYear().toString()
    }

    const earthQuakePayload = {
      lat: Number(latitude),
      lon: Number(longitude),
      time: new Date().toISOString().split('T')[0]
    }

    const result = [];

    const predictedData = await predictFlood({ ...payload });
    console.log(predictedData)
    if (predictedData === 1) {
      const predictedDamageData = await predictFloodDamage({ ...payload })
      let severity;
      if (predictedDamageData === 1) {
        severity = 'Low';
      } else if (predictedDamageData === 2) {

        severity = 'High';
      }

      result.push({ disasterType: 'Flood', riskLevel: predictedDamageData, severity, latitude, longitude })
    }
    const predictFireData = await predictWildFire({ ...wildfirePayload });
    if (predictFireData.occurrence === 1) {
      let severity;
      if (predictFireData.severity === 1) {
        severity = 'Low';
      } else if (predictFireData.severity === 2) {
        severity = 'High';
      }

      result.push({ disasterType: 'Wildfire', riskLevel: predictFireData.severity, severity, latitude, longitude })
    }
    const predictDry = await predictDrought({ ...droughtPayload });
    if (predictDry.occurrence === 1) {
      let severity;
      if (predictDry.severity === 1) {
        severity = 'Low';
      } else if (predictDry.severity === 2) {
        severity = 'High';
      }

      result.push({ disasterType: 'Drought', riskLevel: predictDry.severity, severity, latitude, longitude })
    }
    const predictShock = await predictEarthquake({ ...earthQuakePayload });
    if (predictShock.occurrence === 1) {
      let severity;
      if (predictShock.severity === 1) {
        severity = 'Low';
      } else if (predictShock.severity === 2) {
        severity = 'High';
      }
      result.push({ disasterType: 'Earthquake', riskLevel: predictShock.severity, severity, latitude, longitude })
    }

    await User.findByIdAndUpdate(userId, { $inc: { helpRequestLimit: -1 } });

    if (result.length > 0) {
      await pushToRoles({
        roles: ["ngo", "gov_Agent", "admin"],
        pushType: "SOS",
        excludeUserId: userId,
        data: {
          disasterType: "SOS Emergency",
        }
      });
      return res.status(200).json({ message: "Request submitted & Notification sent", result })
    } else {
      return res.status(404).json({ message: "No disaster found in your area" })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Some error occured try again later!' });
  }
})

const resetHelpRequestLimit = new CronJob("0 0 0 */5 * *",
  async () => {
    try {
      await User.updateMany({}, { $set: { helpRequestLimit: 1 } });
    } catch (error) {
      console.error("Error resetting helpRequestLimit limits:", error);
    }
  },
  null,
  true,
)


const job = new CronJob(
  "0 0 0 * * *",                 // every day at midnight
  async () => {
    try {
      console.log("⏰ Running cleanup cron job...");

      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = await AreaDisaster.deleteMany({
        createdAt: { $lt: cutoff },
      });

      console.log(`🗑 Deleted ${result.deletedCount} old records.`);
    } catch (err) {
      console.error("❌ Error deleting old records:", err);
    }
  },
  null,                          // onComplete (optional)
  true                           // <-- start automatically
);

exports.agenticSend = catchAsync(async (req, res, next) => {
  const { transcript, ngo_Email, ngo_UserId, userName, userEmail, userContact, lat, lng } = req.body;
  const userId = req.user._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" })
  }
  const user = await User.findById(userId);

  if (user.urgencyLimit <= 0) {
    return res.status(403).json({ message: "You have reached your urgency request limit." })
  }
  const audioFile = req.file;
  console.log(audioFile);
  if (!audioFile) return res.status(400).json({ success: false, message: "Audio missing" });


  // ---------------------------
  // 1. CALL GROQ MODEL
  // ---------------------------

  const groqUrl = "https://api.groq.com/openai/v1/chat/completions";

  const schema = {
    type: "object",
    properties: {
      conclusion: { type: "string", enum: ["yes", "no"] },
      danger_level: { type: "number" },
      reason: { type: "string" }
    },
    required: ["conclusion", "danger_level", "reason"],
    additionalProperties: false
  };

  const requestBody = {
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      { role: "system", content: "You are an emergency danger detection AI. Return ONLY JSON." },
      {
        role: "user",
        content: `
Analyze this transcript and determine danger level.

Transcript: "${transcript}"

Rules:
- conclusion = "yes" if user is in danger, distress, trapped, injured, scared, or asking for help check the whole script throughly and then decide whether to send help or not if any time you find transcript is not giving clear indication of emergency then do not send help.
- conclusion = "no" otherwise.
- danger_level = 0 to 100 (0 no danger, 100 extreme danger)
- reason = short explanation.

Return JSON only.
        `
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "dangerCheck", strict: true, schema }
    }
  };

  const groqResp = await axios.post(groqUrl, requestBody, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API}`
    }
  });

  const groqJson = groqResp.data;
  let aiRaw = groqJson?.choices?.[0]?.message?.content;

  // If Groq returns array format → extract text
  if (Array.isArray(aiRaw)) {
    aiRaw = aiRaw.map(p => p.text || "").join("");
  }

  let aiResult;
  try {
    aiResult = JSON.parse(aiRaw);
  } catch {
    return res.status(500).json({ success: false, message: "AI JSON parse failed", aiRaw });
  }
  // ---------------------------
  // 2. DECISION LOGIC
  // ---------------------------

  if (aiResult.conclusion === "no") {
    fs.unlinkSync(audioFile.path);
    return res.status(403).json({
      success: false,
      message: "AI determined there is no emergency.",
      result: aiResult
    });
  }

  // ---------------------------
  // 3. PREPARE EMAIL WITH AUDIO LINK + ATTACHMENT
  // ---------------------------

  let mp3Path;
  try {
    mp3Path = await convertWebmToMp3(audioFile.path);
  } catch (err) {
    console.error("Conversion failed, will attach original file", err);
    mp3Path = null;
  }

  const cloudResult = await cloudinary.uploader.upload(mp3Path, {
    resource_type: "video",
    folder: "ReliefSync_Audio",
    use_filename: true,
    unique_filename: false,
    access_mode: "public",
  });

  const audioUrl = cloudResult.secure_url;

  const subject = `🚨 Emergency Help Request from ${userName}`;

  const htmlBody = `
  <div style="font-family:Arial; line-height:1.5">
    <h2>🚨 Emergency Help Request</h2>

    <p><b>Name:</b> ${userName}</p>
    <p><b>Email:</b> ${userEmail}</p>
    <p><b>Phone:</b> ${userContact}</p>
    <div style="font-family:Arial; line-height:1.5;">
    
    <a href="https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${lat},${lng}"
       target="_blank"
       style="text-decoration:none; color:inherit;"
    >
      <p style="
        font-weight:bold;
        margin:4px 0;
        display:inline-block;
        padding-bottom:3px;
        border-bottom:2px solid transparent;
      "
      onmouseover="this.style.color='green'; this.style.borderBottomColor='green';"
      onmouseout="this.style.color='inherit'; this.style.borderBottomColor='transparent';"
      >
        Location: ${lat}, ${lng}
      </p>
    </a>

  </div>
    <p><b>Transcript:</b> ${transcript}</p>

    <hr/>

    <h3>🧠 AI Danger Analysis</h3>
    <p><b>Conclusion:</b> ${aiResult.conclusion}</p>
    <p><b>Danger Level:</b> ${aiResult.danger_level}/100</p>
    <p><b>Reason:</b> ${aiResult.reason}</p>

    <hr/>

    <h3>🎧 Voice Message</h3>
    <a href="${audioUrl}" target="_blank" style="font-size:18px; font-weight:bold;">
     ▶️ Play Voice Message
     </a>

    <p>Audio file is also attached below.</p>
  </div>
  `;

  const attachments = [];

if (mp3Path && fs.existsSync(mp3Path)) {
  attachments.push({
    name: "voice_message.mp3",
    content: fs.readFileSync(mp3Path).toString("base64"),
  });
}

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "ReliefSync",
          email: process.env.EMAIL,
        },
        to: [{ email: ngo_Email }],
        subject: subject,
        htmlContent: htmlBody
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log(err);
    if (mp3Path) {
      fs.unlink(mp3Path, () => { });
    }

    if (audioFile?.path) {
      fs.unlink(audioFile.path, () => { });
    }
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }

  await User.findByIdAndUpdate(userId, { $inc: { urgencyLimit: -1 } });
  await agenticEmergency({
    ngo_UserId,
    userName,
    reason: aiResult.reason,
    danger_level: aiResult.danger_level,
  })
  return res.status(200).json({
    success: true,
    message: "Email sent successfully.",
    classification: aiResult,
    audioUrl
  });
});

const resetUrgencyLimit = new CronJob("0 0 0 * * *",
  async () => {
    try {
      await User.updateMany({}, { $set: { urgencyLimit: 1 } });
    } catch (error) {
      console.error("Error resetting urgencyLimit limits:", error);
    }
  },
  null,
  true,
);
