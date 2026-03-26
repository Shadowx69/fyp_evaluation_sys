const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  logNumber: { type: Number, required: true },
  weekStartDate: { type: Date, required: true },
  activity: { type: String, required: true },
  hoursSpent: { type: Number, required: true },
  fileUrl: { type: String }, 
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  feedback: String,
  marks: { type: Number, default: 0 } // NEW: Marks out of 10
}, { timestamps: true });

logSchema.index({ projectId: 1, logNumber: 1 }, { unique: true });
module.exports = mongoose.model('Log', logSchema);