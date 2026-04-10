const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String },
  subject:    { type: String },
  message:    { type: String, required: true },
  status:     { type: String, enum: ['New', 'Read', 'Replied'], default: 'New' },
  adminNote:  { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);