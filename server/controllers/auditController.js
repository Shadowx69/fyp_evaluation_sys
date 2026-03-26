const AuditLog = require('../models/AuditLog');

exports.getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'profile.fullName email role')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};