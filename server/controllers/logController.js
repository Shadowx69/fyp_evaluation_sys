const Log = require('../models/Log');
const Project = require('../models/Project');

// @desc    Create Log
exports.createLog = async (req, res) => {
  try {
    const { projectId, logNumber, weekStartDate, activity, hoursSpent } = req.body;
    
    let fileUrl = '';
    if (req.file) {
      fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const newLog = new Log({
      projectId,
      studentId: req.user.id,
      logNumber,
      weekStartDate,
      activity,
      hoursSpent,
      fileUrl
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    // Handle Duplicate Log Number
    if (err.code === 11000) {
      return res.status(400).json({ message: `Log #${req.body.logNumber} already exists.` });
    }
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get Logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find({ projectId: req.params.projectId }).sort({ logNumber: 1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Review Log (Approve with Marks OR Reject)
// @route   PUT /api/logs/:id/review
exports.reviewLog = async (req, res) => {
  try {
    const { status, feedback, marks } = req.body;
    const logId = req.params.id;

    // --- SCENARIO 1: REJECT (Delete) ---
    if (status === 'rejected') {
      const logToDelete = await Log.findById(logId);
      if (!logToDelete) return res.status(404).json({ message: "Log not found" });
      
      const projectId = logToDelete.projectId;
      await Log.findByIdAndDelete(logId);

      // Re-calculate score after deletion (in case a previously approved log was rejected later)
      await updateProjectLogScore(projectId);

      return res.json({ message: 'Log Rejected and Deleted.' });
    }

    // --- SCENARIO 2: APPROVE (Grade) ---
    if (status === 'approved') {
      if (marks === undefined || marks < 0 || marks > 10) {
        return res.status(400).json({ message: "Marks must be between 0 and 10." });
      }

      const log = await Log.findByIdAndUpdate(
        logId, 
        { status, feedback, marks }, 
        { new: true }
      );

      // Trigger Score Recalculation
      await updateProjectLogScore(log.projectId);

      return res.json(log);
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper Function: Calculate and Update Project Score
const updateProjectLogScore = async (projectId) => {
  // 1. Get all APPROVED logs for this project
  const approvedLogs = await Log.find({ projectId, status: 'approved' });

  // 2. Sum total marks obtained
  const totalObtained = approvedLogs.reduce((sum, log) => sum + (log.marks || 0), 0);

  // 3. Calculation:
  // Total possible raw score = 24 logs * 10 marks = 240
  // Weight in final grade = 30
  // Formula: (Obtained / 240) * 30
  let finalLogScore = (totalObtained / 240) * 30;

  // Round to 1 decimal place
  finalLogScore = Math.round(finalLogScore * 10) / 10;

  // 4. Update Project
  await Project.findByIdAndUpdate(projectId, {
    'marks.supervisorLogs': finalLogScore
  });
};