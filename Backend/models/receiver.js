const mongoose = require('mongoose');

const receiverSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    contact: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

// Check if the model is already registered, if not, register it
const Receiver = mongoose.models.Receiver || mongoose.model('Receiver', receiverSchema);

module.exports = Receiver;
