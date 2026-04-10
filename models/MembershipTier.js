const mongoose = require('mongoose');

// This model stores the membership tier configurations.
// Admins can edit prices and benefits directly from the admin panel.
const membershipTierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Silver', 'Gold', 'Platinum'],
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  color: {
    type: String,
    default: '#C0C0C0', // Silver default
  },
  benefits: {
    type: [String], // array of benefit strings
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('MembershipTier', membershipTierSchema);