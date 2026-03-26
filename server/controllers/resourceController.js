const Resource = require('../models/Resource');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/emailService');

// @desc    Upload a Resource (Mandatory Form OR Template)
// @route   POST /api/resources
exports.createResource = async (req, res) => {
  try {
    // 1. Validation: Ensure a file was uploaded via Multer
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Please attach the template/form document." });
    }

    const { title, description, deadline, phase } = req.body;
    
    // Construct the file URL based on your server configuration
    // Ensure your server.js is serving '/uploads' statically
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // 2. Create the Resource Entry
    const resource = new Resource({
      title,
      description,
      // If it's a template, deadline might be null/undefined
      deadline: deadline || null, 
      phase: phase || 'midterm',
      fileUrl,
      uploadedBy: req.user.id
    });

    await resource.save();

    // 3. Notification Logic
    const students = await User.find({ role: 'student' });

    if (students.length > 0) {
      const isTemplate = phase === 'template';
      
      // Customize message based on type
      const notificationMsg = isTemplate
        ? `New Resource: "${title}" is now available in Downloads.`
        : `ACTION REQUIRED: Mandatory form "${title}" uploaded. Due by ${new Date(deadline).toLocaleDateString()}.`;

      const emailSubject = isTemplate 
        ? `New Resource Available - ${title}`
        : `URGENT: Mandatory FYP Form - ${title}`;

      // A. Database Notifications
      const notifications = students.map(student => ({
        userId: student._id,
        message: notificationMsg,
        type: isTemplate ? 'info' : 'alert' // 'alert' highlights it red/yellow in UI
      }));

      await Notification.insertMany(notifications);

      // B. Email Notifications (Async - don't await loop to prevent blocking response)
      students.forEach(student => {
        sendEmail(
          student.email, 
          emailSubject, 
          `Dear Student,\n\n${notificationMsg}\n\nPlease log in to the portal to view and download the document.\n\nRegards,\nFYP Coordinator`
        );
      });
    }

    res.status(201).json(resource);
  } catch (err) {
    console.error("Resource Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
exports.getResources = async (req, res) => {
  try {
    // Sort by newest first, or by deadline if preferred
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
};