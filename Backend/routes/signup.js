const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push('Password must be at least 8 characters long');
  if (!hasUpperCase) errors.push('Password must contain at least one uppercase letter');
  if (!hasLowerCase) errors.push('Password must contain at least one lowercase letter');
  if (!hasNumbers) errors.push('Password must contain at least one number');
  if (!hasSpecialChar) errors.push('Password must contain at least one special character');

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validatePhoneNumber = (phoneNumber) => {
  const errors = [];
  
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if it's exactly 10 digits
  if (cleanNumber.length !== 10) {
    errors.push("Phone number must be exactly 10 digits");
  }
  
  // Check if it starts with a valid prefix (6-9 for Indian numbers)
  if (!/^[6-9]/.test(cleanNumber)) {
    errors.push("Phone number must start with 6, 7, 8, or 9");
  }
  
  // Check if it contains only numbers
  if (!/^\d+$/.test(cleanNumber)) {
    errors.push("Phone number must contain only digits");
  }

  return {
    isValid: errors.length === 0,
    errors,
    cleanNumber
  };
};

// Sign Up Route
router.post('/', async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      return res.status(400).json({ 
        message: 'Invalid phone number',
        errors: phoneValidation.errors
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { phoneNumber: phoneValidation.cleanNumber }
      ]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      phoneNumber: phoneValidation.cleanNumber, // Store cleaned phone number
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

module.exports = router;
