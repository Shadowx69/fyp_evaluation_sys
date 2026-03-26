const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  buid: { type: String, required: true, unique: true }, // University ID
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'supervisor', 'coordinator', 'panelist', 'admin'],
    required: true
  },
  profile: {
    fullName: String,
    department: String,
    specialization: String,
    phone: String,
  },
  // For scheduling algorithm 
  availability: [{
    day: String,
    slots: [String] 
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);