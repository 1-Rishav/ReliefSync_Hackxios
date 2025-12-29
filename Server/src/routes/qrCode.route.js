const router = require("express").Router();

const QrCodeController = require("../controllers/QrCode.controller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", QrCodeController.createQr);
router.post("/get",authMiddleware.authUser, QrCodeController.getQr);
router.delete("/delete", QrCodeController.deleteQr);

module.exports = router;