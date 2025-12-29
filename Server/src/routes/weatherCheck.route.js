const router = require("express").Router();
 const  weatherCheckController = require("../controllers/weatherCheck.controller");

router.get("/check", weatherCheckController.predictedData);
router.get("/allData", weatherCheckController.getAllPredictionData);

module.exports = router;