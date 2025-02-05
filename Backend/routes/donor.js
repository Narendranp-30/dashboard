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
    const donor = new Donor({
      ...req.body,
      donationCertificate: req.file ? req.file.path : null,
    });

    await donor.save();
    res.status(201).json(donor); // Send the saved donor data as response
  } catch (error) {
    res.status(500).json({ error: 'Error saving donor details' });
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
    const donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donor details' });
  }
});


module.exports = router;
