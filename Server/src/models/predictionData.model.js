const mongoose = require("mongoose");

const predictionDataSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    disasterType: {
        type: String,
        required: true
    },
    riskLevel: {
        type: Number,
        required: true
    },
    severity: {
        type: String,   
        required: true
    }
});

const PredictionData = mongoose.model("PredictionData", predictionDataSchema);

module.exports = PredictionData;
