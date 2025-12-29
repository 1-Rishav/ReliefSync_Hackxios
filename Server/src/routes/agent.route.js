const router = require('express').Router();
const agentController = require('../controllers/agent.controller');
const authMiddleware = require('../middleware/authMiddleware');
const {upload} = require('../middleware/multer')
router.post('/agentEntry',authMiddleware.authUser,upload.single('official_id'),agentController.agentEntry);
router.get('/getAgentDetails',authMiddleware.authUser,agentController.getAgentDetails);
router.get('/getAllAgent',authMiddleware.authUser,agentController.getAllAgent);
router.post('/agentToggle',authMiddleware.authUser,agentController.agentToggleStatus);
module.exports = router;