const router = require('express').Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import your Multer config

// Middleware to ensure only Coordinators can upload resources
const coordinatorAuth = (req, res, next) => {
  if (req.user.role !== 'coordinator') {
    return res.status(403).json({ message: 'Access denied. Coordinator only.' });
  }
  next();
};

// @route   GET /api/resources
// @desc    Get all resources (Accessible by all authenticated users)
// @access  Private
router.get('/', auth, resourceController.getResources);

// @route   POST /api/resources
// @desc    Upload a new resource/form/template (Coordinator only)
// @access  Private (Coordinator)
// NOTE: 'file' must match the FormData key sent from the frontend
router.post('/', auth, coordinatorAuth, upload.single('file'), resourceController.createResource);

module.exports = router;