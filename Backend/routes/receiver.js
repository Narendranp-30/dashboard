const express = require('express');
const Receiver = require('../models/receiver');

const router = express.Router();

// ✅ Correct route ("/api/receiver/")
router.post('/', async (req, res) => {
  try {
    const { email, name, age, contact, bloodGroup, state, district, city, address } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    console.log('Creating receiver with data:', req.body);

    const newReceiver = new Receiver({
      email,
      name,
      age,
      contact,
      bloodGroup,
      state,
      district,
      city,
      address,
    });

    const savedReceiver = await newReceiver.save();
    console.log('Saved receiver:', savedReceiver);

    res.status(201).json({ 
      message: 'Receiver details saved successfully!', 
      receiver: savedReceiver 
    });
  } catch (error) {
    console.error('❌ Error saving receiver details:', error);
    res.status(500).json({ 
      message: 'Error saving receiver details. Please try again.',
      error: error.message 
    });
  }
});

// Get receiver details by email
router.get('/details', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const receivers = await Receiver.find({ email });
    res.json(receivers);
  } catch (error) {
    console.error('Error fetching receiver details:', error);
    res.status(500).json({ message: 'Error fetching receiver details' });
  }
});

module.exports = router;
