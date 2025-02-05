const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const donorRoute = require('./routes/donor'); // ✅ Import donor route

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // ✅ Enable CORS

// MongoDB Connection
const connectDB = async () => {
  const uri = 'mongodb://127.0.0.1:27017/BloodDonation';
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// ✅ Correctly Register Routes
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/donor', donorRoute); // ✅ Mounted properly

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
