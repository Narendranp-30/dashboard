// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());  // Enable CORS for frontend requests

// MongoDB Connection
const connectDB = async () => {
  const uri = 'mongodb://127.0.0.1:27017/BloodDonation'; // Your database URI
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
