const mongoose = require('mongoose');

// This stores every membership registration + payment submission
const membershipSchema = new mongoose.Schema({

  // ── Personal Info ──────────────────────────────────────────
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, trim: true, lowercase: true },
  phone:      { type: String, default: '' },
  country:    { type: String, required: true },

  // ── Membership Tier ────────────────────────────────────────
  tier: {
    type: String,
    required: true,
    enum: ['Silver', 'Gold', 'Platinum'],
  },
  tierPrice: {
    type: Number,
    required: true, // price at time of registration (in case admin changes it later)
  },
  currency: {
    type: String,
    default: 'USD',
  },

  // ── Payment Info ───────────────────────────────────────────
  cryptoType: {
    type: String,
    required: true,
    enum: ['Bitcoin', 'Ethereum', 'Solana', 'USDT'],
  },
  transactionHash: {
    type: String,
    required: true,
    trim: true,
  },

  // ── Status (managed from admin panel) ─────────────────────
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending', // all new payments start as Pending
  },

  // Admin notes (e.g. reason for rejection)
  adminNote: {
    type: String,
    default: '',
  },

  approvedAt: {
    type: Date,
    default: null,
  },

}, { timestamps: true });

module.exports = mongoose.model('Membership', membershipSchema);