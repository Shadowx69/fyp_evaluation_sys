const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true },
  
  // Make deadline OPTIONAL (Templates don't need it)
  deadline: { type: Date }, 
  
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Add 'template' to the enum
  phase: { 
    type: String, 
    enum: ['proposal', 'midterm', 'final', 'template'], 
    default: 'midterm' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);