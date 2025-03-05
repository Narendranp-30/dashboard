const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema); 