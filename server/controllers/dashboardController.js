const Announcement = require('../models/Announcement');
const Resource = require('../models/Resource');

// Create Announcement
exports.createAnnouncement = async (req, res) => {
    try {
      const { title, content, roleTarget } = req.body;
      // Default to 'both' if not provided
      const target = roleTarget || 'both';
      
      const ann = new Announcement({
        title, 
        content, 
        roleTarget: target, 
        postedBy: req.user.id
      });
      
      await ann.save();
      res.status(201).json(ann);
    } catch (err) { res.status(500).json({ error: err.message }); }
  };
  
  // Get Announcements (Filtered by User Role)
  exports.getAnnouncements = async (req, res) => {
    try {
      const role = req.user.role;
      let query = {};
  
      if (role === 'student') {
        // Show if target is 'student' OR 'both'
        query = { roleTarget: { $in: ['student', 'both'] } };
      } 
      else if (role === 'supervisor') {
        // Show if target is 'supervisor' OR 'both'
        query = { roleTarget: { $in: ['supervisor', 'both'] } };
      } 
      else if (role === 'coordinator') {
        // Coordinator sees all history
        query = {}; 
      } 
      else {
        // Panelists see nothing
        return res.json([]); 
      }
  
      const anns = await Announcement.find(query).sort({ createdAt: -1 });
      res.json(anns);
    } catch (err) { res.status(500).json({ error: err.message }); }
  };
// UPLOAD TEMPLATE (Coordinator)
exports.uploadTemplate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    const newResource = new Resource({
      title: req.body.title,
      fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      uploadedBy: req.user.id,
      phase: 'template', // Explicitly mark as a generic template
      deadline: null
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// GET TEMPLATES (Student)
exports.getStudentTemplates = async (req, res) => {
  try {
    // Fetch generic templates AND the mandatory phase documents so students can download them
    // Logic: phase is 'template' OR it is a mandatory form ('proposal', 'midterm', 'final')
    const resources = await Resource.find({ 
      $or: [{ phase: 'template' }, { phase: { $in: ['proposal', 'midterm', 'final'] } }] 
    }).sort({ createdAt: -1 });
    
    res.json(resources);
  } catch (err) { res.status(500).json({ error: err.message }); }
};