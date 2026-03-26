const router = require('express').Router();
const logController = require('../controllers/logController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import Multer

// Add upload.single('file') here
router.post('/', auth, upload.single('file'), logController.createLog);

router.get('/:projectId', auth, logController.getLogs);
router.put('/:id/review', auth, logController.reviewLog);

module.exports = router;