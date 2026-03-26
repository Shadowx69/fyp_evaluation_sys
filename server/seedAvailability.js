const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

// Common availability patterns
const standardSlots = [
  { day: 'Monday', slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00'] },
  { day: 'Tuesday', slots: ['09:00-10:00', '11:00-12:00'] },
  { day: 'Wednesday', slots: ['14:00-15:00', '15:00-16:00'] }
];

const seedAvailability = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');

    // Update all Supervisors and Panelists with dummy slots
    const result = await User.updateMany(
      { role: { $in: ['supervisor', 'panelist'] } },
      { $set: { availability: standardSlots } }
    );

    console.log(`Updated ${result.modifiedCount} users with availability.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAvailability();