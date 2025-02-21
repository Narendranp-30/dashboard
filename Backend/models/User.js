const mongoose = require('mongoose');

// Check if model exists before creating
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Removed role field
});

// Use this pattern to prevent model overwrite error
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
