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
    const { firstName, lastName, email, phone, subject, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const contact = new Contact({ firstName, lastName, email, phone, subject, message });
    await contact.save();

    // Email notification to admin
    try {
      await transporter.sendMail({
        from:    `"BYD Contact Form" <${process.env.GMAIL_USER}>`,
        to:      'jamescliford42@gmail.com',
        subject: `📩 New Contact Message — ${firstName} ${lastName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #000; padding: 24px; text-align: center;">
              <h1 style="color: #ffd600; margin: 0;">BYD Admin Panel</h1>
              <p style="color: #888; margin: 4px 0 0;">New Contact Form Submission</p>
            </div>
            <div style="background: #f9f9f9; padding: 32px;">
              <table style="width:100%; border-collapse:collapse;">
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding:12px;color:#888;">Name</td>
                  <td style="padding:12px;font-weight:600;">${firstName} ${lastName}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding:12px;color:#888;">Email</td>
                  <td style="padding:12px;">${email}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding:12px;color:#888;">Phone</td>
                  <td style="padding:12px;">${phone || 'Not provided'}</td>
                </tr>
                <tr style="border-bottom:1px solid #eee;">
                  <td style="padding:12px;color:#888;">Subject</td>
                  <td style="padding:12px;">${subject || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding:12px;color:#888;">Message</td>
                  <td style="padding:12px;">${message}</td>
                </tr>
              </table>
              <a href="https://emmie-backend.onrender.com/admin" 
                 style="display:inline-block;margin-top:24px;background:#ffd600;color:#000;padding:14px 28px;border-radius:8px;font-weight:700;text-decoration:none;">
                View in Admin Panel →
              </a>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Email failed:', emailErr.message);
    }

    return res.status(201).json({ message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;