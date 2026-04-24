const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dealerRoutes = require('./routes/dealerRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const contactRoutes = require('./routes/contactRoutes');

const connectDB = require('./config/db');
const { adminJs, adminRouter } = require('./admin/adminSetup');

const app = express();

// ======================
// CORS Configuration
// ======================
const allowedOrigins = [
  'https://bydtest1.netlify.app',
  'https://bydcarsales.com',
  'https://www.bydcarsales.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5500',
  'https://emmie-backend.onrender.com', // ✅ Added your Render backend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// ======================
// Other Middleware
// ======================
app.use(express.json());

// ✅ Admin panel (after CORS)
app.use(adminJs.options.rootPath, adminRouter);

// API Routes
app.use('/api/dealers', dealerRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/contact', contactRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: '🚗 BYD Dealer API is running!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ======================
// Error handler
// ✅ Now distinguishes CORS errors from general errors
// ======================
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      message: 'CORS error: This origin is not allowed',
      origin: req.headers.origin || 'unknown',
    });
  }
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

// ======================
// Start Server
// ======================
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);

    // ── Keep Render awake (free tier spins down after inactivity) ──
    setInterval(() => {
      fetch('https://emmie-backend.onrender.com/')
        .then(() => console.log('🏓 Keep-alive ping sent'))
        .catch(() => {}); // Silent fail is fine
    }, 4 * 60 * 1000); // Every 4 minutes
  });
});