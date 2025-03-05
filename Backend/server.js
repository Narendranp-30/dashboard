const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RequestModel = require('./models/Request');
const Receiver = require('./models/receiver');
const Donor = require('./models/donor');
const { sendEmail } = require('./services/emailService');
const { sendTelegramAlert } = require('./services/telegramService');

// Import routes
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const donorRoute = require('./routes/donor');
const receiverRoute = require('./routes/receiver');
const matchingRoute = require('./routes/matching');
const bloodBanksRoute = require('./routes/bloodBanks');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/BloodDonation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection failed:', err.message));

// Routes
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/donor', donorRoute);
app.use('/api/receiver', receiverRoute);
app.use('/api/matching', matchingRoute);
app.use('/api/blood-banks', bloodBanksRoute);

// Send Blood Request and Notify Donor
app.post('/api/send-request', async (req, res) => {
  const { senderEmail, receiverEmail, message } = req.body;
  console.log('Received request:', { senderEmail, receiverEmail, message });

  try {
    // Fetch sender (receiver who needs blood)
    const sender = await Receiver.findOne({ email: senderEmail });
    if (!sender) {
      return res.status(404).json({ message: 'Sender (receiver) not found' });
    }

    // Fetch receiver (donor)
    const receiver = await Donor.findOne({ email: receiverEmail });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver (donor) not found' });
    }

    // Validate match
    if (sender.bloodGroup !== receiver.bloodGroup || sender.district !== receiver.district) {
      return res.status(400).json({
        message: 'Not a perfect match',
        details: {
          senderBloodGroup: sender.bloodGroup,
          receiverBloodGroup: receiver.bloodGroup,
          senderDistrict: sender.district,
          receiverDistrict: receiver.district
        }
      });
    }

    // Create the request in DB
    const request = await RequestModel.create({
      senderEmail,
      receiverEmail,
      message,
      status: 'pending',
    });

    // Send email notification
    try {
      const emailSubject = 'URGENT: New Blood Donation Request';
      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e74c3c;">Urgent Blood Donation Request</h2>
          <p>Dear ${receiver.name},</p>
          <p>You have received a new blood donation request:</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Blood Group Needed:</strong> ${receiver.bloodGroup}</p>
            <p><strong>Location:</strong> ${receiver.district}</p>
            <p><strong>Requester Name:</strong> ${sender.name}</p>
            <p><strong>Contact Number:</strong> ${sender.contact}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
          <p>Please respond to this request as soon as possible by:</p>
          <ol>
            <li>Logging into your account</li>
            <li>Going to the Received Requests section</li>
            <li>Accepting or denying the request</li>
          </ol>
          <p style="color: #e74c3c;">Your quick response could help save a life!</p>
          <hr>
          <p style="font-size: 12px; color: #666;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `;

      await sendEmail(receiverEmail, emailSubject, emailContent);

      console.log('Created request and sent email notification');
      res.status(201).json({
        message: 'Request sent successfully and email notification delivered',
        request
      });
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      res.status(201).json({
        message: 'Request sent successfully but email notification failed',
        request
      });
    }
  } catch (error) {
    console.error('Error sending request:', error);
    res.status(500).json({
      message: 'Failed to send request',
      error: error.message
    });
  }
});

// Fetch received requests
app.get('/api/received-requests', async (req, res) => {
  const { email } = req.query;
  try {
    const requests = await RequestModel.find({ receiverEmail: email });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching received requests:', error);
    res.status(500).json({ message: 'Failed to fetch received requests' });
  }
});

// Update request status
app.put('/api/received-requests/:requestId', async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    ).exec();

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Fetch sender (receiver who needs blood) and donor details
    const sender = await Receiver.findOne({ email: updatedRequest.senderEmail });
    const donor = await Donor.findOne({ email: updatedRequest.receiverEmail });

    // Send email notification to the receiver
    const emailSubject = `Blood Donation Request ${status.toUpperCase()}`;
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${status === 'accepted' ? '#4CAF50' : '#f44336'};">
          Blood Donation Request ${status.toUpperCase()}
        </h2>
        <p>Dear ${sender.name},</p>
        <p>Your blood donation request has been <strong>${status}</strong> by the donor.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Donor Name:</strong> ${donor.name}</p>
          <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
          <p><strong>Location:</strong> ${donor.district}</p>
          ${status === 'accepted' ? `
            <p><strong>Contact Number:</strong> ${donor.contact}</p>
            <p><strong>Email:</strong> ${donor.email}</p>
          ` : ''}
        </div>
        
        ${status === 'accepted' ? `
          <p style="color: #4CAF50;">
            Please contact the donor as soon as possible to arrange the donation.
          </p>
        ` : `
          <p style="color: #f44336;">
            We encourage you to look for other matching donors in your area.
          </p>
        `}
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    try {
      await sendEmail(updatedRequest.senderEmail, emailSubject, emailContent);
      console.log('Status update email sent successfully');
    } catch (emailError) {
      console.error('Error sending status update email:', emailError);
    }

    res.json(updatedRequest);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Failed to update request status' });
  }
});

// Delete request
app.delete('/api/received-requests/:requestId', async (req, res) => {
  const { requestId } = req.params;

  try {
    const deletedRequest = await RequestModel.findByIdAndDelete(requestId);

    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Failed to delete request' });
  }
});

// Fetch sent requests
app.get('/api/sent-requests', async (req, res) => {
  const { senderEmail } = req.query;

  try {
    const requests = await RequestModel.find({ senderEmail });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    res.status(500).json({ message: 'Failed to fetch sent requests' });
  }
});

// Add SOS endpoint
app.post('/api/sos', async (req, res) => {
  try {
    console.log('Received SOS request:', req.body); // Debug log
    const { donor, requester } = req.body;

    // Send Telegram alert
    await sendTelegramAlert(donor, requester);
    console.log('Telegram alert sent successfully'); // Debug log

    res.json({ message: 'SOS alert sent successfully' });
  } catch (error) {
    console.error('Error sending SOS:', error);
    res.status(500).json({ 
      error: 'Failed to send SOS alert',
      details: error.message 
    });
  }
});

// Admin routes
app.get('/api/admin/donors', async (req, res) => {
  try {
    const donors = await Donor.find();
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donors' });
  }
});

app.get('/api/admin/receivers', async (req, res) => {
  try {
    const receivers = await Receiver.find();
    res.json(receivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching receivers' });
  }
});

app.get('/api/admin/requests', async (req, res) => {
  try {
    const requests = await RequestModel.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Admin delete routes
app.delete('/api/admin/donors/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Delete donor
    const deletedDonor = await Donor.findOneAndDelete({ email });
    if (!deletedDonor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Delete associated requests
    await RequestModel.deleteMany({ 
      $or: [
        { senderEmail: email },
        { receiverEmail: email }
      ]
    });

    res.json({ message: 'Donor and associated requests deleted successfully' });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ message: 'Error deleting donor' });
  }
});

app.delete('/api/admin/receivers/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Delete receiver
    const deletedReceiver = await Receiver.findOneAndDelete({ email });
    if (!deletedReceiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Delete associated requests
    await RequestModel.deleteMany({ 
      $or: [
        { senderEmail: email },
        { receiverEmail: email }
      ]
    });

    res.json({ message: 'Receiver and associated requests deleted successfully' });
  } catch (error) {
    console.error('Error deleting receiver:', error);
    res.status(500).json({ message: 'Error deleting receiver' });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
