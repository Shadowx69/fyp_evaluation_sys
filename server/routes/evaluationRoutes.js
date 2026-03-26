const router = require('express').Router();
const evaluationController = require('../controllers/evaluationController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, evaluationController.submitEvaluation);

module.exports = router;