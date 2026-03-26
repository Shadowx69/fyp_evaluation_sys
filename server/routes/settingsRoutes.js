const router = require('express').Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/authMiddleware');

// Middleware to ensure only Coordinators can change settings
const coordinatorAuth = (req, res, next) => {
  if (req.user.role !== 'coordinator') {
    return res.status(403).json({ message: 'Access denied. Coordinator only.' });
  }
  next();
};

// GET /api/settings - Anyone logged in can check if proposals are open
router.get('/', auth, settingsController.getSettings);

// PUT /api/settings - Only Coordinator can update
router.put('/', auth, coordinatorAuth, settingsController.updateSettings);

module.exports = router;