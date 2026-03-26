const multer = require('multer');
const path = require('path');

// Configure Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists in your root directory
  },
  filename: function (req, file, cb) {
    // Save file as: fieldname-timestamp.extension
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// File Filter (Optional: Restrict to PDF/Docs)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf' || 
    file.mimetype === 'application/msword' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'application/vnd.ms-powerpoint' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word, and PPT allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

module.exports = upload;