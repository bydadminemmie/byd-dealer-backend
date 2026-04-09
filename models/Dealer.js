const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  dealerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, enum: ['Europe', 'Asia', 'Africa', 'Americas', 'Middle East', 'Oceania'], required: true },
  flag: { type: String },
  stockCount: { type: Number, default: 0 },
  stockLevel: { type: String, enum: ['High', 'Mid', 'Low'] },
  rating: { type: Number, min: 0, max: 5 },
  yearsActive: { type: Number },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  modelsAvailable: [{ type: String }],
  certified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Dealer', dealerSchema);