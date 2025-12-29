const router = require('express').Router();
const razorpayController = require("../controllers/razorpay.controller");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-donation',authMiddleware.authUser,razorpayController.createDonation);
router.post('/razorpay-webhook',razorpayController.RazorpayWebHook);

module.exports=router;