const router = require('express').Router();
const submissionController = require('../controllers/submissionController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Import Multer

// DELETE the old duplicate line that was here!

// @route   GET /api/submissions/:projectId
router.get('/:projectId', auth, submissionController.getSubmissions);

// @route   PUT /api/submissions/:id/feedback
router.put('/:id/feedback', auth, submissionController.addFeedback);

// @route   POST /api/submissions
// This is the ONLY correct POST route. It MUST have 'upload.single'
router.post('/', auth, upload.single('file'), submissionController.createSubmission);

module.exports = router;