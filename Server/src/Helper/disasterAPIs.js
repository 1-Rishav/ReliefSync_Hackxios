const axios = require('axios');

const predictFlood = async (...payload) => {

  try {
    const response = await axios.post(
      `${process.env.FLOOD_API}/predict/happen`,
      ...payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.prediction[0];
  } catch (error) {

    return {
      success: false,
      status: error.status,
      message: error.message
    }
  }
}

const predictFloodDamage = async (...payload) => {

  try {
    const response = await axios.post(
      `${process.env.FLOOD_API}/predict/damage`,
      ...payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.prediction[0];
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      status: 401,
      message: error.message
    }
  }
}

const predictWildFire = async (...payload) => {
  try {
    const response = await axios.post(`${process.env.WILDFIRE_API}/predict`, ...payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return { occurrence: response.data.occurrence_class, severity: response.data.severity_class }
  } catch (error) {
    return { status: 401, message: error.message }
  }
}

const predictDrought = async (...payload) => {
  try {
    const response = await axios.post(`${process.env.DROUGHT_API}/predict`, ...payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return { occurrence: response.data.occurrence_class, severity: response.data.severity_class }
  } catch (error) {
    return { status: 401, message: error.message }
  }

}

const predictEarthquake = async (...payload) => {
  try {
    const response = await axios.post(`${process.env.EARTHQUAKE_API}/predict`, ...payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return { occurrence: response.data.occurrence_prediction.will_occur, severity: response.data.severity_prediction.severity_class }
  } catch (error) {
    return { status: 401, message: error }
  }
}

module.exports = { predictFlood, predictFloodDamage, predictWildFire, predictDrought, predictEarthquake };