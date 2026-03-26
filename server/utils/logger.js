const AuditLog = require('../models/AuditLog');

const logAction = async (userId, action, details) => {
  try {
    await AuditLog.create({ user: userId, action, details });
  } catch (err) {
    console.error("Audit Log Error:", err.message);
  }
};

module.exports = logAction;