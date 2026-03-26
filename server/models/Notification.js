const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  type: { type: String, default: 'info' } // info, alert, success
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);