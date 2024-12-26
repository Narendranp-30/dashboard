// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController'); // Import login function
// POST /signup route to handle signup requests
router.post('/signup', signup);
// POST /login route to handle login requests
router.post('/login', login);

module.exports = router;
exports.signup = async (req, res) => {
    const { email, phoneNumber, password, role } = req.body;
  
    try {
      // Check if the user exists with the same email and role
      const existingUser = await User.findOne({ email, role });
  
      if (existingUser) {
        return res.status(400).json({ message: `You are already signed up as ${role}. Please log in.` });
      }
  
      // Allow re-signup with the same email for a different role
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        phoneNumber,
        password: hashedPassword,
        role,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'Signup successful. Please log in to continue.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error signing up user' });
    }
  };
  exports.login = async (req, res) => {
    const { email, password, role } = req.body;
  
    try {
      const user = await User.findOne({ email, role });
  
      if (!user) {
        return res.status(400).json({ message: 'No account found with this email and role.' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      res.json({ message: 'Login successful', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error logging in user' });
    }
  };
    