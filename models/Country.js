const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,   // always stored as e.g. "NG", "DE", "US"
    trim: true
  },
  region: {
    type: String,
    enum: ['Europe', 'Asia', 'Africa', 'Americas', 'Middle East', 'Oceania'],
    required: true
  },
  flag: {
    type: String,
    default: ''
  },
  hasOfficialDealer: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true     // true = shows on the public website
  },
  dealerCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Country', countrySchema);
