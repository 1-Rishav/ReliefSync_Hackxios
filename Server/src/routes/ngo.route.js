const router = require('express').Router();
const ngoController = require('../controllers/ngo.controller');
const authMiddleware = require('../middleware/authMiddleware');
const {upload} = require('../middleware/multer')
router.post('/ngoEntry',authMiddleware.authUser,upload.single('Official_docs'),ngoController.ngoEntry);
router.get('/getNgoDetails',authMiddleware.authUser,ngoController.getNgoDetails);
router.get('/getAllNGO',authMiddleware.authUser , ngoController.getAllNGO);
router.post('/ngoToggle',authMiddleware.authUser,ngoController.ngoToggleStatus);

module.exports = router;