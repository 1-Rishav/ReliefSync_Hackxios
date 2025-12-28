const axios = require('axios')
const ee = require('@google/earthengine');
const fs = require('fs');
//const privateKey = require('../../config/reliefsync-service-account.json'); // your key file
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
// Initialize Earth Engine
function initEarthEngine() {
  return new Promise((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(serviceAccount, () => {
      ee.initialize(null, null, resolve, reject);
    }, reject);
  });
}

// Convert lat/lon to EE point
function pointFromLatLng(lat, lng) {
  return ee.Geometry.Point([lng, lat]);
}

// Get current month rainfall from CHIRPS dataset
async function getRainfall(point) {
  const now = ee.Date(Date.now()); // First of current month

  const start = now.advance(-2, 'month');

  const chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
    .filterDate(start, now)
    .filterBounds(point)
    .select('precipitation');

  const count = await chirps.size().getInfo();
  if (count === 0) {
    console.warn('No CHIRPS rainfall data found for the period:', start.getInfo(), '-', now.getInfo());
    return 2;
  }

  const monthlySum = chirps.sum();

  const dict = await monthlySum.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: point,
    scale: 5000,
    maxPixels: 1e9
  }).getInfo();

  return dict['precipitation'] == 0 ? 2 : dict['precipitation'];
}

// Get elevation from SRTM
function getElevation(point) {
  const srtm = ee.Image('USGS/SRTMGL1_003');
  return srtm.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: point,
    scale: 30
  }).get('elevation');
}

// Get slope using terrain
function getSlope(point) {
  const terrain = ee.Terrain.products(ee.Image('USGS/SRTMGL1_003'));
  return terrain.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: point,
    scale: 30
  }).get('slope');
}

// Get distance to nearest permanent water body
function getWaterDistance(point) {
  const jrc = ee.Image('JRC/GSW1_3/GlobalSurfaceWater');
  const mask = jrc.select('occurrence').gt(80); // permanent water bodies

  const distance = mask
    .not()
    .fastDistanceTransform()
    .sqrt()
    .multiply(30)               // originally in meters
    .divide(1000)               // ✅ convert to kilometers
    .rename('distance_km');     // rename the band to reflect km

  return distance.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: point,
    scale: 30,
    maxPixels: 1e9
  }).get('distance_km');         // ✅ match renamed band
}

// Main function
async function getDisasterData(lat, lng) {
  await initEarthEngine();
  const point = await pointFromLatLng(lat, lng);
  const [rainfall, elevation, slope, waterDistance] = await Promise.all([
    getRainfall(point),
    getElevation(point).getInfo(),
    getSlope(point).getInfo(),
    getWaterDistance(point).getInfo()
  ]);
  //console.log(rainfall, elevation, slope, waterDistance)
  return {
    rainfall_mm: rainfall,
    elevation_m: elevation,
    slope_deg: slope,
    distance_to_water_m: waterDistance
  };
}

module.exports = { getDisasterData };