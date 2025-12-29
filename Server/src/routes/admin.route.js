const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/getAllNGO',authMiddleware.authUser,adminController.getAllNGO);
router.get('/getAllAgent',authMiddleware.authUser,adminController.getAllAgent);
router.post('/verifyNGO',authMiddleware.authUser,adminController.verifyNGO);
router.post('/verifyAgent',authMiddleware.authUser,adminController.verifyAgent);

module.exports = router;