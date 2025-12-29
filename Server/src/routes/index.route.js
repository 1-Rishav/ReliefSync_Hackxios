const router = require("express").Router()
const auth = require("./auth.route");
const user = require("./user.route")
const admin = require('./admin.route');
const ngo = require('./ngo.route');
const agent = require('./agent.route');
const notification = require('./notification.route')
const razorpay = require('./razorpay.route')
const disasterReport = require('./disasterReport.route')
const qrCode = require("./qrCode.route")
const autoCheck = require("./weatherCheck.route")

router.use("/auth",auth);
router.use("/user",user);
router.use("/admin",admin);
router.use("/ngo",ngo),
router.use("/agent",agent);
router.use("/disasterReport",disasterReport)
router.use("/notify",notification)
router.use("/donate",razorpay)
router.use("/qrcode",qrCode)
router.use('/weather',autoCheck)

module.exports = router;

