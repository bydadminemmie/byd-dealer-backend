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
// CORS Configuration - Fixed & Improved
// ======================
const allowedOrigins = [
  'https://bydtest1.netlify.app',
  'https://bydcarsales.com',
  'https://www.bydcarsales.com',
  'https://byd-int-*.netlify.app',     // This covers random Netlify preview URLs
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5500',             // VS Code Live Server
];

// Better CORS setup for beginners
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`); // Helpful for debugging
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,                    // Important if you use cookies later
}));

// ======================
// Other Middleware
// ======================
app.use(express.json());

// Admin panel
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

// Error handler
app.use((err, req, res, next) => {
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
  });
});