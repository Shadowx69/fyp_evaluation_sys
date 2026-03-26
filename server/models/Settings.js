const mongoose = require('mongoose');
const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'global_config'
  allowProposals: { type: Boolean, default: true },
  currentSession: String // e.g., "Fall 2025"
});
module.exports = mongoose.model('Settings', settingsSchema);