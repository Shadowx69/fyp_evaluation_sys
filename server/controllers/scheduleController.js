const Project = require('../models/Project');
const User = require('../models/User');

// Helper: Generate slots for next 3 days (9am - 4pm)
const generateTimeSlots = () => {
  const slots = [];
  const today = new Date();
  for (let i = 1; i <= 3; i++) { // Next 3 days
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Hours 9, 10, 11, 12, 14, 15, 16
    [9, 10, 11, 12, 14, 15, 16].forEach(hour => {
      const time = new Date(date);
      time.setHours(hour, 0, 0, 0);
      slots.push(time);
    });
  }
  return slots;
};

// ... existing imports and generateTimeSlots helper ...

exports.autoScheduleBatch = async (req, res) => {
  try {
    const { phase } = req.body; 
    console.log(`[Scheduler] Starting batch for phase: ${phase}`);

    let query = {};
    if (phase === 'midterm') {
      // FIX: Broaden scope. Allow 'supervisor_endorsed' (waiting for defense) AND 'proposal_approved'
      query = { status: { $in: ['supervisor_endorsed', 'proposal_approved'] } };
    } else if (phase === 'final') {
      query = { status: { $in: ['final_report_submitted', 'plagiarism_cleared', 'midterm_completed'] } };
    }

    // DEBUG: Log how many projects match
    const totalProjects = await Project.countDocuments();
    const eligibleProjects = await Project.find(query).populate('studentId supervisorId');
    
    console.log(`[Scheduler] Total Projects: ${totalProjects}`);
    console.log(`[Scheduler] Eligible for ${phase}: ${eligibleProjects.length}`);

    if (eligibleProjects.length === 0) {
      return res.json([]); // Return empty list (Frontend handles the alert)
    }

    const panelists = await User.find({ role: { $in: ['supervisor', 'panelist'] } });
    let availableSlots = generateTimeSlots();
    const schedule = [];

    for (const project of eligibleProjects) {
      if (availableSlots.length === 0) break;

      const slot = availableSlots.shift(); 
      
      // Filter out own supervisor
      const eligiblePanel = panelists.filter(p => 
        project.supervisorId && p._id.toString() !== project.supervisorId._id.toString()
      );
      
      // Pick 2 panelists
      const assignedPanel = eligiblePanel.slice(0, 2);

      schedule.push({
        projectId: project._id,
        projectTitle: project.title,
        studentName: project.studentId?.profile?.fullName || 'Unknown',
        supervisor: project.supervisorId?.profile?.fullName || 'Unknown',
        panel: assignedPanel.map(p => p.profile.fullName),
        date: slot,
        room: `Lab-${Math.floor(Math.random() * 5) + 1}`
      });
    }

    res.json(schedule);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};