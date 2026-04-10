const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    enum: [
      'BYD Seal',
      'BYD Atto 3',
      'BYD Dolphin',
      'BYD Han',
      'BYD Tang',
      'BYD Seagull',
      'BYD Sealion',
      'BYD Destroyer 05'
    ]
  },
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',   // links this vehicle to a dealer
    required: true
  },
  color: {
    type: String,
    default: 'White'
  },
  year: {
    type: Number,
    default: 2024
  },
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  inStock: {
    type: Boolean,
    default: true
  },
  mileage: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    enum: ['New', 'Used', 'Demo'],
    default: 'New'
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);