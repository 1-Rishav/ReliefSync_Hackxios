const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authMiddleware")
router.post("/register",authController.register,authController.sendOtp);
router.post("/verifyEmail",authController.verifyOtp)
router.post("/login",authController.login,authController.sendOtp);
router.post("/forgetPassword",authController.forgotPassword);
router.post("/resetPassword",authController.resetPassword,authController.sendOtp);
router.get("/logout",authController.logout)
router.post("/googleAuth", authController.googleAuth);

module.exports = router;