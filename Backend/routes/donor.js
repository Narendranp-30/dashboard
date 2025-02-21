const express = require('express');
const multer = require('multer');
const Donor = require('../models/donor'); // Donor model

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ✅ POST route for donor details (Saving to DB)
router.post('/', upload.single('donationCertificate'), async (req, res) => {
  try {
    console.log('Received donor data:', req.body);
    
    // Check if donor already exists with this contact
    const existingDonor = await Donor.findOne({ contact: req.body.contact });
    if (existingDonor) {
      return res.status(400).json({ 
        error: 'A donor with this contact number already exists',
        details: 'Please use a different contact number or update your existing record'
      });
    }
    
    const donorData = {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
      contact: req.body.contact,
      bloodGroup: req.body.bloodGroup,
      teetotaler: req.body.teetotaler === 'true',
      height: req.body.height,
      weight: req.body.weight,
      state: req.body.state,
      district: req.body.district,
      city: req.body.city,
      address: req.body.address,
      healthDefects: req.body.healthDefects,
      donationCertificate: req.file ? req.file.path : null,
    };

    console.log('Creating donor with data:', donorData);

    const donor = new Donor(donorData);
    const savedDonor = await donor.save();
    
    console.log('Saved donor:', savedDonor);
    res.status(201).json(savedDonor);
  } catch (error) {
    console.error('Error saving donor:', error);
    // Send more user-friendly error message
    if (error.code === 11000) {
      res.status(400).json({ 
        error: 'Duplicate contact number', 
        details: 'This contact number is already registered' 
      });
    } else {
      res.status(500).json({ 
        error: 'Error saving donor details', 
        details: error.message 
      });
    }
  }
});
// ✅ PUT route to update donor details by contact
router.put('/:contact', upload.single('donationCertificate'), async (req, res) => {
  try {
    const { contact } = req.params;
    const updateData = {
      ...req.body,
      donationCertificate: req.file ? req.file.path : req.body.donationCertificate, // Keep existing file if no new file is uploaded
    };

    const updatedDonor = await Donor.findOneAndUpdate(
      { contact }, // Find by contact
      updateData,   // Update with new data
      { new: true } // Return the updated document
    );

    if (!updatedDonor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.json(updatedDonor);
  } catch (error) {
    res.status(500).json({ error: 'Error updating donor details' });
  }
});


// ✅ DELETE route to delete donor details by contact
router.delete('/:contact', async (req, res) => {
  try {
    const { contact } = req.params;
    const deletedDonor = await Donor.findOneAndDelete({ contact });

    if (!deletedDonor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting donor details' });
  }
});



// ✅ GET route to fetch donor details by contact
// Get all donors
router.get('/details', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log('Fetching details for email:', userEmail); // Debug log

    if (!userEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const donors = await Donor.find({ email: userEmail });
    console.log('Found donors:', donors); // Debug log
    res.json(donors);
  } catch (error) {
    console.error('Error in /details route:', error);
    res.status(500).json({ error: 'Failed to fetch donor details' });
  }
});


module.exports = router;
