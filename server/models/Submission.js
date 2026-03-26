const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, 
  fileUrl: { type: String, required: true }, // This must be required
  type: { type: String, default: 'report' },
  status: { type: String, default: 'submitted' },
  feedback: String,
  grade: Number,
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);