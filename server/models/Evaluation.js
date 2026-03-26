const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  type: { 
    type: String, 
    enum: ['proposal_defense', 'midterm', 'final_viva'], 
    required: true 
  },
  panelistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  criteria: {
    technicalDepth: { type: Number, min: 0, max: 10 },
    methodology: { type: Number, min: 0, max: 10 },
    presentation: { type: Number, min: 0, max: 10 },
    documentation: { type: Number, min: 0, max: 10 },
    innovation: { type: Number, min: 0, max: 10 }
  },
  comments: String,
  totalScore: Number
}, { timestamps: true });

// Auto-calculate total score before saving
evaluationSchema.pre('save', function(next) {
  const c = this.criteria;
  this.totalScore = c.technicalDepth + c.methodology + c.presentation + c.documentation + c.innovation;
  next();
});

module.exports = mongoose.model('Evaluation', evaluationSchema);