const express = require('express');
const Donor = require('../models/donor');
const Receiver = require('../models/receiver');

const router = express.Router();

// ✅ Matching API - Find matching donors for receivers
router.get('/', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log('Fetching matches for email:', userEmail);

    if (!userEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const donors = await Donor.find();
    const receivers = await Receiver.find({ email: userEmail });

    const matches = receivers.map(receiver => {
      const matchedDonors = donors.filter(donor =>
        donor.bloodGroup === receiver.bloodGroup &&
        donor.district === receiver.district &&
        donor.email !== userEmail
      );

      return {
        receiver,
        matchedDonors
      };
    });

    console.log(`Found ${matches.length} matches for email:`, userEmail);
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

module.exports = router;
