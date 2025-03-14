const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

// Get all requests associated with a user (either as sender or receiver)
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  
  try {
    // Find all requests where the user is either the sender or receiver
    const requests = await Request.find({
      $or: [
        { senderEmail: email },
        { receiverEmail: email }
      ]
    }).sort({ createdAt: -1 }); // Sort by creation date, newest first
    
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark a request as donated (blood donation completed)
router.put('/mark-donated/:requestId', async (req, res) => {
  const { requestId } = req.params;
  
  try {
    const request = await Request.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Check if the request is in 'accepted' status
    if (request.status !== 'accepted') {
      return res.status(400).json({ 
        message: 'Cannot mark as donated. Request must be in accepted status'
      });
    }
    
    // Update the request to mark it as donated
    request.donated = true;
    request.donatedDate = new Date();
    
    await request.save();
    
    res.status(200).json({ 
      message: 'Request marked as donated successfully',
      request 
    });
  } catch (error) {
    console.error('Error marking request as donated:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if a donor has already donated
router.get('/donor-status/:email', async (req, res) => {
  const { email } = req.params;
  
  try {
    // Check if the donor has any donated requests in the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const donatedRequest = await Request.findOne({
      receiverEmail: email,
      donated: true,
      donatedDate: { $gte: ninetyDaysAgo }
    });
    
    res.status(200).json({
      hasRecentlyDonated: !!donatedRequest,
      lastDonation: donatedRequest ? donatedRequest.donatedDate : null
    });
  } catch (error) {
    console.error('Error checking donor status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
