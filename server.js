const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dealerRoutes = require('./routes/dealerRoutes');
const connectDB = require('./config/db');

const { adminJs, adminRouter } = require('./admin/adminSetup');

const app = express();

const allowedOrigins = [
  'https://bydtest1.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000'
];





app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.use(adminJs.options.rootPath, adminRouter);

app.use('/api/dealers', dealerRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🚗 BYD Dealer API is running!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔐 Admin panel: http://localhost:${PORT}/admin`);
  });
});