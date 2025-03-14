const express = require('express');
const Donor = require('../models/donor');
const Receiver = require('../models/receiver');
const Request = require('../models/Request');

const router = express.Router();

// Matching API - Find matching donors for receivers
router.get('/', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log('Fetching matches for email:', userEmail);

    if (!userEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find all donors
    const donors = await Donor.find();
    const receivers = await Receiver.find({ email: userEmail });

    // Find recently donated donors (within the last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const recentlyDonatedDonors = await Request.find({
      donated: true,
      donatedDate: { $gte: ninetyDaysAgo }
    }).distinct('receiverEmail'); // Get unique donor emails

    console.log('Excluding recently donated donors:', recentlyDonatedDonors);

    const matches = receivers.map(receiver => {
      // Filter donors: match blood group and district, not the user, and hasn't recently donated
      const matchedDonors = donors.filter(donor => 
        donor.bloodGroup === receiver.bloodGroup &&
        donor.district === receiver.district &&
        donor.email !== userEmail &&
        !recentlyDonatedDonors.includes(donor.email)
      );
      
      // Get donors who would match but have recently donated
      const recentlyDonatedMatchingDonors = donors.filter(donor => 
        donor.bloodGroup === receiver.bloodGroup &&
        donor.district === receiver.district &&
        donor.email !== userEmail &&
        recentlyDonatedDonors.includes(donor.email)
      ).map(donor => ({
        ...donor.toObject(),
        recentlyDonated: true
      }));

      return {
        receiver,
        matchedDonors,
        recentlyDonatedMatchingDonors
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
