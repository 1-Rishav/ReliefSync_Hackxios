const mongoose = require("mongoose");

const coordinateSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
});

module.exports = mongoose.model("Coordinate", coordinateSchema);