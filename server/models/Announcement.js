const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // 'both' targets Students + Supervisors. Panelists are excluded.
  roleTarget: { 
    type: String, 
    enum: ['student', 'supervisor', 'both'], 
    required: true 
  } 
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);