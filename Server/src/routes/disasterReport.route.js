const router = require("express").Router();
const disasterController = require("../controllers/disasterReport.controller")
const authMiddleware = require('../middleware/authMiddleware')
const { upload } = require('../middleware/multer')

router.post('/uploadTempImage1', authMiddleware.authUser, upload.single('file1'), disasterController.uploadTempImage)
router.post('/uploadTempImage2', authMiddleware.authUser, upload.single('file2'), disasterController.uploadTempImage)
router.post('/deleteTempImage1', authMiddleware.authUser, disasterController.deleteTempImage)
router.post('/deleteTempImage2', authMiddleware.authUser, disasterController.deleteTempImage)
router.post('/enquiry', authMiddleware.authUser, upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 },]), disasterController.disasterEnquiry)
router.post('/fireEnquiry', authMiddleware.authUser, upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), disasterController.wildFireEnquiry)
router.post('/dryEnquiry', authMiddleware.authUser, upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), disasterController.droughtEnquiry)
router.post('/shockEnquiry', authMiddleware.authUser, upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), disasterController.earthquakeEnquiry)
router.post('/areaEnquiry', authMiddleware.authUser, disasterController.areaEnquiry)
router.post('/precaution', authMiddleware.authUser, disasterController.GenAIPrecaution)
router.get('/getAreaDisaster', authMiddleware.authUser, disasterController.getAreaDisaster)
router.post('/sosAlert', authMiddleware.authUser, disasterController.sosEmergency);
router.post('/urgencyMail', authMiddleware.authUser, upload.single('audio'), disasterController.agenticSend);

module.exports = router;