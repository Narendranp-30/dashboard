const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RequestModel = require('./models/Request');
const Receiver = require('./models/receiver');
const Donor = require('./models/donor');

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

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Example endpoint to handle sending requests
app.post('/api/send-request', async (req, res) => {
  const { senderEmail, receiverEmail, message } = req.body;

  try {
    // Fetch the receiver's details
    const receiver = await Receiver.findOne({ email: receiverEmail });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Validate the match
    const isPerfectMatch = await Donor.exists({
      email: senderEmail,
      bloodGroup: receiver.bloodGroup,
      district: receiver.district
    });

    if (!isPerfectMatch) {
      return res.status(400).json({ message: 'Not a perfect match' });
    }

    const request = await RequestModel.create({
      senderEmail,
      receiverEmail,
      message,
      status: 'pending',
    });

    res.status(201).json({ message: 'Request sent successfully', request });
  } catch (error) {
    console.error('Error sending request:', error);
    res.status(500).json({ message: 'Failed to send request' });
  }
});

// Example endpoint to fetch received requests
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