const mongoose = require('mongoose');

const evClubSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,   // no duplicate emails
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    required: true
  },
  interestedModel: {
    type: String,
    default: 'Not specified'
  },
  agreedToTerms: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('EVClub', evClubSchema);