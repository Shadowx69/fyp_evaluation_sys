const router = require('express').Router();
const dashController = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Your Multer config

// Public to all authenticated users
router.get('/announcements', auth, dashController.getAnnouncements);
router.get('/templates', auth, dashController.getStudentTemplates);

// Coordinator Only
router.post('/announcements', auth, dashController.createAnnouncement);
router.post('/templates', auth, upload.single('file'), dashController.uploadTemplate);

module.exports = router;