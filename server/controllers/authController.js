const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logAction = require('../utils/logger');

exports.register = async (req, res) => {
  try {
    const { buid, email, password, role, fullName } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      buid, email, role,
      password: hashedPassword,
      profile: { fullName }
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );
    logAction(user._id, 'LOGIN', `User logged in with role: ${user.role}`);
    res.json({ token, user: { id: user._id, role: user.role, name: user.profile.fullName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};