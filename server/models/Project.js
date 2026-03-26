const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  supervisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  status: {
    type: String,
    enum: [
      'registered', 'revision_required', 'supervisor_endorsed', 
      'proposal_approved', 'midterm_completed', 'final_report_submitted', 
      'plagiarism_cleared', 'final_completed', 'graduated'
    ],
    default: 'registered'
  },
  
  plagiarismScore: { type: Number, default: 0 },
  
  // --- NEW: GRADING FIELDS ---
  marks: {
    supervisorLogs: { type: Number, default: 0 }, // Max 30
    midterm: { type: Number, default: 0 },        // Max 30
    finalViva: { type: Number, default: 0 },      // Max 40
    total: { type: Number, default: 0 }           // Max 100
  },
  
  // --- NEW: FILE TRACKING FLAGS ---
  hasMidtermPresentation: { type: Boolean, default: false },
  hasFinalReport: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);