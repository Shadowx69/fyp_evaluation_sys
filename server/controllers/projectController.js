const Project = require('../models/Project');
const User = require('../models/User');
const Settings = require('../models/Settings');
const Log = require('../models/Log');
const logAction = require('../utils/logger');
const Submission = require('../models/Submission');

exports.createProject = async (req, res) => {
  try {
    // 1. Check Global Settings (Is registration open?)
    const settings = await Settings.findOne({ key: 'global_config' });
    if (settings && !settings.allowProposals) {
      return res.status(403).json({ message: "Proposals are currently closed by the Coordinator." });
    }

    // 2. Validate File Upload (Crucial for Proposal)
    if (!req.file) {
      return res.status(400).json({ message: "You must upload the filled Proposal Document." });
    }

    const { title, description, members } = req.body;
    let project;

    // 3. Check for Existing Project (Handle Revision vs New)
    const existingProject = await Project.findOne({ studentId: req.user.id });

    if (existingProject) {
      // SCENARIO A: UPDATE EXISTING (If revision was requested)
      if (existingProject.status === 'revision_required') {
        existingProject.title = title;
        existingProject.description = description;
        // Optionally update members if logic allows
        if (members) existingProject.teamMembers = JSON.parse(members); 
        
        existingProject.status = 'registered'; // Reset status to registered for re-evaluation
        project = await existingProject.save();
      } else {
        // SCENARIO B: ALREADY ACTIVE
        return res.status(400).json({ message: 'You already have an active project.' });
      }
    } else {
      // SCENARIO C: CREATE NEW PROJECT
      
      // Check if student is part of another team
      const checkTeam = await Project.findOne({ teamMembers: req.user.id });
      if (checkTeam) return res.status(400).json({ message: 'You are already part of a project team.' });

      // Handle Members (FormData sends arrays as JSON strings)
      let teamMembers = members ? JSON.parse(members) : [];
      // Ensure the creator is included in the team
      if (!teamMembers.includes(req.user.id)) {
        teamMembers.push(req.user.id);
      }

      project = new Project({
        title,
        description,
        studentId: req.user.id,
        teamMembers: teamMembers,
        status: 'registered'
      });

      await project.save();
    }

    // 4. Save the Proposal File as a 'Submission' (For both New & Revised projects)
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    const submission = new Submission({
      projectId: project._id,
      studentId: req.user.id,
      title: existingProject ? 'Revised Proposal Document' : 'Initial Proposal Document',
      type: 'proposal',
      fileUrl: fileUrl
    });
    
    await submission.save();

    res.status(201).json(project);

  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get All Projects
exports.getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') query = { teamMembers: req.user.id };
    else if (req.user.role === 'supervisor') query = { supervisorId: req.user.id };

    const projects = await Project.find(query)
      .populate('studentId', 'profile.fullName')
      .populate('teamMembers', 'profile.fullName email')
      .populate('supervisorId', 'profile.fullName');
    res.json(projects);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Add Team Member
exports.addTeamMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (project.teamMembers.length >= 4) return res.status(400).json({ message: 'Team full.' });
    
    const student = await User.findOne({ email, role: 'student' });
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    if (project.teamMembers.includes(student._id)) return res.status(400).json({ message: 'Already in team.' });

    project.teamMembers.push(student._id);
    await project.save();
    
    const updated = await Project.findById(req.params.id)
      .populate('teamMembers', 'profile.fullName email')
      .populate('studentId', 'profile.fullName')
      .populate('supervisorId', 'profile.fullName');
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Update Status
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const project = await Project.findById(req.params.id);
    if (project.supervisorId.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    project.status = status;
    await project.save();
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Delete Project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Supervisor Endorsement
exports.endorseProposal = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const supervisorIdStr = project.supervisorId.toString();
    const userIdStr = req.user.id.toString();

    if (supervisorIdStr !== userIdStr) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    
    project.status = 'supervisor_endorsed';
    await project.save();
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Committee Approves Proposal
exports.committeeApproveProposal = async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { status: 'proposal_approved' });
    res.json({ message: 'Proposal Approved' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Check Eligibility (Logs)
exports.checkEligibility = async (req, res) => {
  try {
    const approvedLogs = await Log.countDocuments({ projectId: req.params.id, status: 'approved' });
    res.json({ approvedLogs });
  } catch (err) { res.status(500).json({ error: err.message }); }
};



// --- THIS WAS MISSING AND CAUSED THE CRASH ---
// @desc    Get List of Supervisors
exports.getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }).select('profile.fullName _id');
    res.json(supervisors);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
// @desc    Supervisor Grades Logs (Max 30)
exports.gradeLogs = async (req, res) => {
  try {
    const { marks } = req.body;
    const project = await Project.findById(req.params.id);

    // 1. Authorization Check
    if (project.supervisorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 2. Status Check (RESTRICTION LOGIC)
    // Grading is NOT allowed if: Registered, Revision Required, or just Endorsed (not yet approved by committee)
    const invalidStatuses = ['registered', 'revision_required', 'supervisor_endorsed'];
    if (invalidStatuses.includes(project.status)) {
      return res.status(400).json({ message: "Cannot grade yet. Proposal must be approved by the committee first." });
    }

    // 3. Marks Validation
    if (marks > 30) return res.status(400).json({ message: "Max marks is 30" });
    
    project.marks.supervisorLogs = marks;
    await project.save();
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Submit Final Report (Student)
exports.submitFinalReport = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    // Logic: Ensure they have passed midterm before submitting final
    if (project.status !== 'midterm_completed') {
        return res.status(400).json({ message: "Complete Midterm phase first." });
    }
    
    project.status = 'final_report_submitted';
    // Mark flag for UI helpers
    project.hasFinalReport = true; 
    
    await project.save();
    res.json({ message: 'Final Report Submitted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Coordinator Checks Plagiarism
exports.checkPlagiarism = async (req, res) => {
  try {
    const { similarity } = req.body;
    const project = await Project.findById(req.params.id);

    project.plagiarismScore = similarity;

    if (similarity > 20) {
      project.status = 'revision_required'; // Send back to student
    } else {
      project.status = 'plagiarism_cleared'; // Forward to Panelist
    }

    await project.save();
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.gradePhase = async (req, res) => {
  try {
    const { phase, marks } = req.body;
    const project = await Project.findById(req.params.id);

    // --- NEW: FETCH APPROVED LOG COUNT ---
    const logCount = await Log.countDocuments({ projectId: req.params.id, status: 'approved' });

    if (phase === 'midterm') {
      // 1. Check Log Requirement (12)
      if (logCount < 12) {
        return res.status(400).json({ message: `Evaluation Blocked: Student needs 12 approved logs. Current: ${logCount}.` });
      }
      // 2. Check File Requirement
      if (!project.hasMidtermPresentation) {
        return res.status(400).json({ message: "Evaluation Blocked: Midterm Presentation missing." });
      }
      // 3. Check Marks
      if (marks > 30) return res.status(400).json({ message: "Max Midterm marks is 30." });
      
      project.marks.midterm = marks;
      project.status = 'midterm_completed';
    } 
    else if (phase === 'final') {
      // 1. Check Log Requirement (24)
      if (logCount < 24) {
        return res.status(400).json({ message: `Evaluation Blocked: Student needs 24 approved logs. Current: ${logCount}.` });
      }
      // 2. Check File & Plagiarism
      if (!project.hasFinalReport) {
        return res.status(400).json({ message: "Evaluation Blocked: Final Report missing." });
      }
      if (project.status !== 'plagiarism_cleared') {
        return res.status(400).json({ message: "Evaluation Blocked: Plagiarism check pending." });
      }
      // 3. Check Marks
      if (marks > 40) return res.status(400).json({ message: "Max Final marks is 40." });

      project.marks.finalViva = marks;
      project.status = 'final_completed';
    }

    await project.save();
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// @desc    Coordinator Publishes Result
exports.publishResult = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (project.status !== 'final_completed') {
       return res.status(400).json({ message: "Grading incomplete." });
    }

    const total = (project.marks.supervisorLogs || 0) + 
                  (project.marks.midterm || 0) + 
                  (project.marks.finalViva || 0);
    
    project.marks.total = total;
    project.status = 'graduated';
    
    await project.save();
    logAction(req.user.id, 'PUBLISH_RESULT', `Published Final Results for Project ${project.title}`);
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Add this function at the end or with other committee functions
exports.committeeRejectProposal = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    // Optional: Add check to ensure user is actually a panelist
    if (req.user.role !== 'panelist') {
        return res.status(403).json({ message: "Only Panelists can perform this action." });
    }

    project.status = 'revision_required';
    await project.save();
    
    res.json({ message: 'Proposal Rejected. Sent back for revision.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};