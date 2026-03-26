const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // You will replace the URI with your MongoDB Atlas string
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;