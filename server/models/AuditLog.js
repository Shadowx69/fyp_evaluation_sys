const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true }, // e.g., 'LOGIN', 'GRADE_UPDATE', 'FILE_UPLOAD'
  details: { type: String }, // e.g., "Graded Midterm: 25/30"
  ip: String,
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);