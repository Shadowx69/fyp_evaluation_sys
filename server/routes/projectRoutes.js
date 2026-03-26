const router = require('express').Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const coordinatorAuth = (req, res, next) => {
  if (req.user.role !== 'coordinator') {
    return res.status(403).json({ message: 'Access denied. Coordinator only.' });
  }
  next();
};

// 1. General Project Routes
// FIX: Added upload middleware here and removed the duplicate below
router.post('/', auth, upload.single('file'), projectController.createProject); 
router.get('/', auth, projectController.getProjects);
router.delete('/:id', auth, coordinatorAuth, projectController.deleteProject);

// 2. Team Management
router.put('/:id/add-member', auth, projectController.addTeamMember);

// 3. Supervisor & Committee Actions
router.put('/:id/endorse', auth, projectController.endorseProposal);
router.put('/:id/status', auth, projectController.updateProjectStatus);
router.put('/:id/approve-proposal', auth, projectController.committeeApproveProposal);

// 4. Grading & Evaluation
router.get('/:id/eligibility', auth, projectController.checkEligibility);
router.put('/:id/grade-logs', auth, projectController.gradeLogs);
router.put('/:id/grade-phase', auth, projectController.gradePhase);
router.put('/:id/reject-proposal', auth, projectController.committeeRejectProposal);

// 5. Final Phase & Publishing
router.put('/:id/submit-final', auth, projectController.submitFinalReport);
router.put('/:id/plagiarism', auth, projectController.checkPlagiarism);
router.put('/:id/publish', auth, projectController.publishResult);

// 6. Helpers
router.get('/supervisors', auth, projectController.getSupervisors);

module.exports = router;