const router = require('express').Router();
const auditController = require('../controllers/auditController');
const auth = require('../middleware/authMiddleware');

const coordinatorAuth = (req, res, next) => {
  if (req.user.role !== 'coordinator') return res.status(403).json({ message: 'Access denied' });
  next();
};

router.get('/', auth, coordinatorAuth, auditController.getLogs);

module.exports = router;