const express = require('express');
const router  = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

console.log("✅ Contact routes loaded"); // DEBUG

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ✅ MAIN HANDLER (shared logic)
async function handleContact(req, res) {
  try {
    console.log("🔥 Incoming request body:", req.body);

    const { firstName, lastName, email, phone, subject, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      console.log("❌ Missing required fields");
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
    console.log("✅ Saved contact:", contact);

    // Email notification
    try {
      await transporter.sendMail({
        from: `"BYD Contact Form" <${process.env.GMAIL_USER}>`,
        to: 'jamescliford42@gmail.com',
        subject: `📩 New Contact Message — ${firstName} ${lastName}`,
        html: `<p>New contact message received</p>`
      });

      console.log("📧 Email sent successfully");

    } catch (emailErr) {
      console.error('❌ Email failed:', emailErr.message);
    }

    return res.status(201).json({ message: 'Message sent successfully!' });

  } catch (err) {
    console.error('❌ Contact form error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

// ✅ SUPPORT BOTH ROUTES
router.post('/', handleContact);
router.post('/submit', handleContact);

module.exports = router;