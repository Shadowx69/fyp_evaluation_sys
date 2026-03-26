const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

router.get('/unread', auth, notificationController.getUnreadNotifications);
router.put('/:id/read', auth, notificationController.markAsRead);

module.exports = router;