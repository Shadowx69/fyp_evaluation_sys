const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  let settings = await Settings.findOne({ key: 'global_config' });
  if (!settings) {
    settings = await Settings.create({ key: 'global_config', allowProposals: true });
  }
  res.json(settings);
};

exports.updateSettings = async (req, res) => {
  const settings = await Settings.findOneAndUpdate(
    { key: 'global_config' }, 
    req.body, 
    { new: true, upsert: true }
  );
  res.json(settings);
};