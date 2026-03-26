const router = require('express').Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/authMiddleware');

// Only Coordinators should access this
const coordinatorAuth = (req, res, next) => {
  if (req.user.role !== 'coordinator') {
    return res.status(403).json({ message: 'Access denied. Coordinator only.' });
  }
  next();
};

// Route for the new Batch Scheduler
router.post('/batch', auth, coordinatorAuth, scheduleController.autoScheduleBatch);

module.exports = router;