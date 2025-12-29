const router = require('express').Router()
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');
const {upload} = require('../middleware/multer');

router.get('/getUser',authMiddleware.authUser,userController.getUser)
router.post('/changeProfile',authMiddleware.authUser,upload.single('profile'),userController.changeProfile);
router.post('/changeName',authMiddleware.authUser,userController.changeName);
router.post('/changeEmailOrPass',authMiddleware.authUser,userController.changeEmailOrPass);
router.post('/changeHelp',authMiddleware.authUser,userController.toggleHelp);
router.post('/feedStatus',authMiddleware.authUser,userController.toggleFeedback);
router.delete('/removeAccount',authMiddleware.authUser,userController.removeAccount);
router.post('/submitFeedback',authMiddleware.authUser,userController.feedBackEntry);
router.get('/getFeedbacks',authMiddleware.authUser,userController.getAllFeedbacks);
router.get('/getUnverifiedNGO',authMiddleware.authUser,userController.UnverifiedNGOCount);
router.get('/getUnverifiedAgent',authMiddleware.authUser,userController.UnverifiedAgentCount);
router.post('/toggleAgency',authMiddleware.authUser,userController.toggleAgencyStatus);
router.post('/toggleEmergency',authMiddleware.authUser,userController.toggleEmergencyStatus);
router.post('/defaultAllocationAndStatus',authMiddleware.authUser,userController.resetAllocationAndStatus);
router.post('/resetAllocation',authMiddleware.authUser,userController.resetAllocationOnly);

module.exports = router;