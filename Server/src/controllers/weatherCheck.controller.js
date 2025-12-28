const Coordinate = require("../models/coordinates.model")
const predictionModel = require("../models/predictionData.model")
const catchAsync = require("../utils/catchAsync")
const axios = require("axios")
const { CronJob } = require('cron');
const { getDisasterData } = require('../Helper/fetchFloodReport');
const { predictFlood, predictFloodDamage, predictWildFire, predictDrought, predictEarthquake } = require("../Helper/disasterAPIs");

exports.predictedData = catchAsync(async (req, res) => {
  try {
    const data = await predictionModel.find({
      $or: [
        { riskLevel: 2, severity: 'High' },
        { riskLevel: 1, severity: 'Low' },

      ]
    }).limit(2);
    return res.status(200).json({ data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

exports.getAllPredictionData = catchAsync(async (req, res) => {
  try {
    const data = await predictionModel.find();
    return res.status(200).json({ data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})


//*/10 * * * * *
const weatherCheck = new CronJob('0 0 0 */10 * *', async function () {
  try {
    const cursor = Coordinate.find().cursor();
    for await (const doc of cursor) {
      const { lat: latitude, lon: longitude } = doc;
      const { rainfall_mm, elevation_m, slope_deg, distance_to_water_m } = await getDisasterData((latitude), (longitude));
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

      const predictedData = await predictFlood({ ...payload });

      if (predictedData === 1) {
        const predictedDamageData = await predictFloodDamage({ ...payload })
        let severity;
        if (predictedDamageData === 1) {
          severity = 'Low';
        } else if (predictedDamageData === 2) {

          severity = 'High';
        }
        const predictedInfo = new predictionModel({
          latitude,
          longitude,
          disasterType: 'Flood',
          riskLevel: predictedDamageData,
          severity
        })
        await predictedInfo.save();
      }
      const predictFireData = await predictWildFire({ ...wildfirePayload });
      if (predictFireData.occurrence === 1) {
        let severity;
        if (predictFireData.severity === 1) {
          severity = 'Low';
        } else if (predictFireData.severity === 2) {
          severity = 'High';
        }
        const predictedInfo = new predictionModel({
          latitude,
          longitude,
          disasterType: 'Wildfire',
          riskLevel: predictFireData.severity,
          severity
        })
        await predictedInfo.save();
      }
      const predictDry = await predictDrought({ ...droughtPayload });
      if (predictDry.occurrence === 1) {
        let severity;
        if (predictDry.severity === 1) {
          severity = 'Low';
        } else if (predictDry.severity === 2) {

          severity = 'High';
        }
        const predictedInfo = new predictionModel({
          latitude,
          longitude,
          disasterType: 'Drought',
          riskLevel: predictDry.severity,
          severity
        })
        await predictedInfo.save();
      }
    }
  } catch (error) {
    console.log('Error occurred while fetching disaster data:', error);
  }
},
  null,
  true
);

const earthQuakeCheck = new CronJob('0 0 0 */2 * *', async (req, res) => {
  try {
    const cursor = Coordinate.find().cursor();
    for await (const doc of cursor) {
      const { lat: latitude, lon: longitude } = doc;
      const earthquakePayload = {
        lat: Number(latitude),
        lon: Number(longitude),
        time: new Date().toISOString().split('T')[0]
      }

      const predictShock = await predictEarthquake({ ...earthquakePayload });
      if (predictShock.occurrence === 1) {
        let severity;
        if (predictShock.severity === 1) {
          severity = 'Low';
        } else if (predictShock.severity === 2) {

          severity = 'High';
        }
        const predictedInfo = new predictionModel({
          latitude,
          longitude,
          disasterType: 'Earthquake',
          riskLevel: predictShock.severity,
          severity
        })
        await predictedInfo.save();
      }
    }
  } catch (error) {
    console.log('Error occurred while fetching earthquake data:', error);
  }
})


