const Notification = require('../models/Notification');

// @desc    Get unread notifications for the user
// @route   GET /api/notifications/unread
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      userId: req.user.id, 
      isRead: false 
    }).sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id, 
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};