const Submission = require('../models/Submission');
const Project = require('../models/Project');

// @desc    Submit Document
exports.createSubmission = async (req, res) => {
  try {
    const { projectId, title, type } = req.body;
    
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const submission = new Submission({
      projectId,
      studentId: req.user.id,
      title,
      type: type || 'report',
      fileUrl
    });

    await submission.save();

    // --- FIX: Auto-update Status for Workflow Visibility ---
    if (type === 'presentation') {
      await Project.findByIdAndUpdate(projectId, { hasMidtermPresentation: true });
    } 
    else if (type === 'report') {
      // Automatically move status to 'final_report_submitted' so Coordinator sees it
      await Project.findByIdAndUpdate(projectId, { 
        hasFinalReport: true,
        status: 'final_report_submitted' 
      });
    }

    res.status(201).json(submission);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Get Submissions
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Review Submission (Grade/Reject)
// @route   PUT /api/submissions/:id/feedback
exports.addFeedback = async (req, res) => {
  try {
    const { feedback, grade, status } = req.body;

    // --- REJECTION LOGIC: DELETE ---
    if (status === 'rejected') {
      await Submission.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Submission Rejected and Deleted.' });
    }

    // --- GRADING LOGIC ---
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { 
        feedback, 
        grade, // Saves grade for this specific file
        status: 'reviewed' 
      },
      { new: true }
    );
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};