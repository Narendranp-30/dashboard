const User = require('../models/User'); // Import User model
const bcrypt = require('bcryptjs');

// Signup Controller
exports.signup = async (req, res) => {
  const { email, phoneNumber, password } = req.body; // Removed role

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists. Please log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      phoneNumber,
      password: hashedPassword, // Removed role
    });

    await newUser.save();

    res.status(201).json({ message: 'Signup successful. Please log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error signing up user' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password, role } = req.body; // Retained role for login

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'No account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Ensure role validation if role exists
    if (role && user.role !== role) {
      return res.status(400).json({ message: `You are not registered as ${role}. Please select the correct role.` });
    }

    res.json({ message: 'Login successful', user: { email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in user' });
  }
};
