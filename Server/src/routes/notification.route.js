const router = require("express").Router();
const notificationController  = require("../controllers/notification.controller")
const authMiddleware = require('../middleware/authMiddleware')

router.get("/segment",authMiddleware.authUser, notificationController.notifySegment)
router.post("/user",notificationController.sendNotification)
module.exports = router;