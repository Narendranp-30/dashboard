const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  email: { type: String, required: true }, // User's email from localStorage
  donorEmail: { type: String, required: true }, // Donor's email address
  name: String,
  age: Number,
  contact: { type: String, required: true, unique: true }, // ✅ Ensure contact is unique
  bloodGroup: String,
  teetotaler: Boolean,
  height: Number,
  weight: Number,
  state: String,
  district: String,
  city: String,
  address: String,
  healthDefects: String,
  donationCertificate: String,
});

const Donor = mongoose.model('Donor', donorSchema);

module.exports = Donor;
