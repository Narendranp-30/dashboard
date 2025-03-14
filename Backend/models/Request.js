const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' },
  donated: { type: Boolean, default: false },
  donatedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add pre-save middleware to update the updatedAt field
requestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Request', requestSchema);