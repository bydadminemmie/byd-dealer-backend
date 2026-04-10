const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

router.post('/submit', async (req, res) => {
  try {
    console.log("🔥 Incoming request body:", req.body); // ✅ DEBUG

    const { firstName, lastName, email, phone, subject, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      console.log("❌ Missing required fields"); // ✅ DEBUG
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const contact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message
    });

    await contact.save();

    console.log("✅ Saved contact:", contact); // ✅ DEBUG

    // Email notification to admin
    try {
      await transporter.sendMail({
        from: `"BYD Contact Form" <${process.env.GMAIL_USER}>`,
        to: 'jamescliford42@gmail.com',
        subject: `📩 New Contact Message — ${firstName} ${lastName}`,
        html: `<p>New contact message received</p>`
      });

      console.log("📧 Email sent successfully"); // ✅ DEBUG

    } catch (emailErr) {
      console.error('❌ Email failed:', emailErr.message);
    }

    return res.status(201).json({ message: 'Message sent successfully!' });

  } catch (err) {
    console.error('❌ Contact form error:', err); // ✅ DEBUG
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;