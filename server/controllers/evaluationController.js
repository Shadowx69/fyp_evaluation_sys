const Evaluation = require('../models/Evaluation');

// @desc    Submit Evaluation Score
// @route   POST /api/evaluations
exports.submitEvaluation = async (req, res) => {
  try {
    const { projectId, type, criteria, comments } = req.body;

    // Prevent duplicate evaluations
    const existingEval = await Evaluation.findOne({ 
      projectId, panelistId: req.user.id, type 
    });

    if (existingEval) {
      return res.status(400).json({ message: 'You have already evaluated this project.' });
    }

    const evaluation = new Evaluation({
      projectId,
      type,
      panelistId: req.user.id,
      criteria,
      comments
    });

    await evaluation.save();
    res.status(201).json(evaluation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};