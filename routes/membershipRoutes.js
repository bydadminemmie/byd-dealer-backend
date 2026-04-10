const express        = require('express');
const router         = express.Router();
const nodemailer     = require('nodemailer');
const Membership     = require('../models/Membership');
const MembershipTier = require('../models/MembershipTier');

// ── Email transporter ────────────────────────────────────────────────────────
// Uses Gmail to send notification emails to the admin.
// Requires GMAIL_USER and GMAIL_PASS in your .env file.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Gmail App Password (not your regular password)
  },
});

// ── Seed default tiers if they don't exist ───────────────────────────────────
// This runs once when the server starts to create the default tier data.
async function seedTiers() {
  const count = await MembershipTier.countDocuments();
  if (count === 0) {
    await MembershipTier.insertMany([
      {
        name: 'Silver',
        price: 750,
        currency: 'USD',
        color: '#C0C0C0',
        sortOrder: 1,
        benefits: [
          'Official BYD EV Club membership',
          'Monthly newsletter with EV news',
          'Free shipping on BYD merchandise',
          'Entry into grand prize EV draw',
        ],
      },
      {
        name: 'Gold',
        price: 1050,
        currency: 'USD',
        color: '#FFD700',
        sortOrder: 2,
        benefits: [
          'Everything in Silver',
          'Priority customer support',
          'Early access to latest BYD models',
          'Free test drive at any certified dealer',
          'Free shipping on all orders',
        ],
      },
      {
        name: 'Platinum',
        price: 1750,
        currency: 'USD',
        color: '#E5E4E2',
        sortOrder: 3,
        benefits: [
          'Everything in Gold',
          'Dedicated personal dealer contact',
          'Exclusive car sales discount',
          'VIP invitations to BYD launch events',
          'Priority dealer placement assistance',
        ],
      },
    ]);
    console.log('✅ Default membership tiers created');
  }
}
seedTiers();

// ── GET /api/membership/tiers ────────────────────────────────────────────────
// Frontend calls this to get current tier prices and benefits
router.get('/tiers', async (req, res) => {
  try {
    const tiers = await MembershipTier.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json(tiers);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch membership tiers.' });
  }
});

// ── POST /api/membership/register ───────────────────────────────────────────
// Receives membership registration + payment submission from checkout.html
router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      tier,
      cryptoType,
      transactionHash,
    } = req.body;

    // ── Validation ─────────────────────────────────────────────────────────
    if (!firstName || !lastName || !email || !country || !tier || !cryptoType || !transactionHash) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // Check for duplicate transaction hash (prevents double submissions)
    const existingTx = await Membership.findOne({ transactionHash });
    if (existingTx) {
      return res.status(409).json({
        message: 'This transaction hash has already been submitted.',
      });
    }

    // Get current tier price
    const tierData = await MembershipTier.findOne({ name: tier });
    if (!tierData) {
      return res.status(400).json({ message: 'Invalid membership tier selected.' });
    }

    // ── Save membership to MongoDB ──────────────────────────────────────────
    const membership = new Membership({
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.toLowerCase().trim(),
      phone:     phone?.trim() || '',
      country,
      tier,
      tierPrice: tierData.price,
      currency:  tierData.currency,
      cryptoType,
      transactionHash: transactionHash.trim(),
      paymentStatus: 'Pending',
    });

    await membership.save();

    // ── Send email notification to admin ───────────────────────────────────
    try {
      await transporter.sendMail({
        from:    `"BYD Admin Panel" <${process.env.GMAIL_USER}>`,
        to:      'jamescliford42@gmail.com',
        subject: `🔔 New ${tier} Membership Payment — ${firstName} ${lastName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #000; padding: 24px; text-align: center;">
              <h1 style="color: #ffd600; margin: 0; font-size: 24px;">BYD Admin Panel</h1>
              <p style="color: #888; margin: 4px 0 0;">New Membership Payment Received</p>
            </div>

            <div style="background: #f9f9f9; padding: 32px;">
              <h2 style="color: #111; margin-top: 0;">
                New ${tier} Membership — Action Required
              </h2>
              <p style="color: #555;">A new membership payment has been submitted and is waiting for your approval.</p>

              <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr style="background: #fff; border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 16px; color: #888; font-size: 13px; width: 40%;">Name</td>
                  <td style="padding: 12px 16px; color: #111; font-weight: 600;">${firstName} ${lastName}</td>
                </tr>
                <tr style="background: #f9f9f9; border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 16px; color: #888; font-size: 13px;">Email</td>
                  <td style="padding: 12px 16px; color: #111;">${email}</td>
                </tr>
                <tr style="background: #fff; border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 16px; color: #888; font-size: 13px;">Country</td>
                  <td style="padding: 12px 16px; color: #111;">${country}</td>
                </tr>
                <tr style="background: #f9f9f9; border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 16px; color: #888; font-size: 13px;">Tier</td>
                  <td style="padding: 12px 16px; font-weight: 700; color: ${tier === 'Platinum' ? '#888' : tier === 'Gold' ? '#b8860b' : '#666'};">${tier}</td>
                </tr>
                <tr style="background: #fff; border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 16px; color: #888; font-size: 13px;">Amount</td>
                  <td style="padding: 12px 16px; color: #111; font-weight: 600;">$${tierData.price} ${tierData.currency}</td>
                </tr>
                <tr style="background: #f9f9f9; border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 16px; color: #888; font-size: 13px;">Crypto</td>
                  <td style="padding: 12px 16px; color: #111;">${cryptoType}</td>
                </tr>
                <tr style="background: #fff;">
                  <td style="padding: 12px 16px; color: #888; font-size: 13px;">TX Hash</td>
                  <td style="padding: 12px 16px; color: #111; font-family: monospace; font-size: 12px; word-break: break-all;">${transactionHash}</td>
                </tr>
              </table>

              <a href="https://emmie-backend.onrender.com/admin" 
                 style="display: inline-block; background: #ffd600; color: #000; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
                Review in Admin Panel →
              </a>
            </div>

            <div style="background: #eee; padding: 16px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">BYD Dealer Directory Admin Panel</p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      // Don't fail the registration if email fails — just log it
      console.error('Email notification failed:', emailErr.message);
    }

    return res.status(201).json({
      message: 'Payment submitted successfully! Your membership will be activated within 24 hours after verification.',
    });

  } catch (err) {
    console.error('Membership registration error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;