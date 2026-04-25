const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSMongoose = require('@adminjs/mongoose');
const bcrypt = require('bcrypt');
const connectMongo = require('connect-mongo');

// ─── MODELS ─────────────────────────────────────────────
const MembershipTier = require('../models/MembershipTier');
const Membership     = require('../models/Membership');
const Dealer         = require('../models/Dealer');
const Vehicle        = require('../models/Vehicle');
const EVClub         = require('../models/EVClub');
const Country        = require('../models/Country');
const Contact        = require('../models/Contact');

AdminJS.registerAdapter(AdminJSMongoose);

// ─── Allowed Origins ────────────────────────────────────
const allowedOrigins = [
  'https://bydtest1.netlify.app',
  'https://byd-int.onrender.com',
  'https://bydcarsales.com',
  'https://www.bydcarsales.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5500',
  'https://emmie-backend.onrender.com',
];

const adminJs = new AdminJS({
  resources: [

    // ─── MEMBERSHIP TIERS ─────────────────────────────────────
    {
      resource: MembershipTier,
      options: {
        navigation: { name: 'Memberships', icon: 'CreditCard' },
        listProperties: ['name', 'price', 'currency', 'isActive', 'sortOrder'],
        editProperties: ['name', 'price', 'currency', 'color', 'benefits', 'isActive', 'sortOrder'],
        showProperties: ['name', 'price', 'currency', 'color', 'benefits', 'isActive', 'sortOrder'],
      },
    },

    // ─── MEMBERSHIP PAYMENTS ──────────────────────────────────
    {
      resource: Membership,
      options: {
        navigation: { name: 'Memberships', icon: 'CreditCard' },
        actions: { new: { isAccessible: false } },
        listProperties: ['firstName', 'lastName', 'email', 'tier', 'tierPrice', 'cryptoType', 'paymentStatus', 'createdAt'],
        filterProperties: ['tier', 'paymentStatus', 'cryptoType'],
        editProperties: ['paymentStatus', 'adminNote'],
        showProperties: ['firstName', 'lastName', 'email', 'phone', 'country', 'tier', 'tierPrice', 'currency', 'cryptoType', 'transactionHash', 'paymentStatus', 'adminNote', 'approvedAt', 'createdAt'],
      },
    },

    // ─── CONTACTS ─────────────────────────────────────────────
    {
      resource: Contact,
      options: {
        navigation: { name: 'Contacts', icon: 'MessageCircle' },
        actions: {
          new: { isAccessible: false },
        },
        listProperties: ['firstName', 'lastName', 'email', 'subject', 'status', 'createdAt'],
        filterProperties: ['status'],
        editProperties: ['status', 'adminNote'],
        showProperties: ['firstName', 'lastName', 'email', 'phone', 'subject', 'message', 'status', 'adminNote', 'createdAt'],
      },
    },

    // ─── DEALERS ──────────────────────────────────────────────
    {
      resource: Dealer,
      options: {
        navigation: { name: 'Dealer Network', icon: 'Building' },
        listProperties: [
          'dealerId', 'name', 'country', 'city',
          'region', 'stockCount', 'stockLevel', 'certified', 'rating'
        ],
        filterProperties: ['country', 'region', 'certified', 'stockLevel'],
        editProperties: [
          'dealerId', 'name', 'country', 'city', 'region', 'flag',
          'stockCount', 'stockLevel', 'rating', 'yearsActive',
          'address', 'phone', 'email', 'website',
          'modelsAvailable', 'certified'
        ],
        showProperties: [
          'dealerId', 'name', 'country', 'city', 'region', 'flag',
          'stockCount', 'stockLevel', 'rating', 'yearsActive',
          'address', 'phone', 'email', 'website',
          'modelsAvailable', 'certified', 'createdAt', 'updatedAt'
        ],
      },
    },

    // ─── VEHICLES ─────────────────────────────────────────────
    {
      resource: Vehicle,
      options: {
        navigation: { name: 'Vehicles', icon: 'Car' },
        listProperties: [
          'model', 'dealer', 'color', 'year',
          'price', 'currency', 'condition', 'inStock'
        ],
        filterProperties: ['model', 'condition', 'inStock', 'year'],
        editProperties: [
          'model', 'dealer', 'color', 'year',
          'price', 'currency', 'mileage', 'condition', 'inStock'
        ],
        showProperties: [
          'model', 'dealer', 'color', 'year', 'price',
          'currency', 'mileage', 'condition', 'inStock',
          'createdAt', 'updatedAt'
        ],
      },
    },

    // ─── EV CLUB ──────────────────────────────────────────────
    {
      resource: EVClub,
      options: {
        navigation: { name: 'EV Club', icon: 'User' },
        actions: {
          new:  { isAccessible: false },
          edit: { isAccessible: false },
        },
        listProperties: [
          'firstName', 'lastName', 'email',
          'country', 'interestedModel', 'createdAt'
        ],
        filterProperties: ['country', 'interestedModel', 'agreedToTerms'],
        showProperties: [
          'firstName', 'lastName', 'email', 'phone',
          'country', 'interestedModel', 'agreedToTerms', 'createdAt'
        ],
      },
    },

    // ─── COUNTRIES ────────────────────────────────────────────
    {
      resource: Country,
      options: {
        navigation: { name: 'Countries', icon: 'Globe' },
        listProperties: [
          'name', 'code', 'region',
          'hasOfficialDealer', 'dealerCount', 'isActive'
        ],
        filterProperties: ['region', 'hasOfficialDealer', 'isActive'],
        editProperties: [
          'name', 'code', 'region', 'flag',
          'hasOfficialDealer', 'dealerCount', 'isActive'
        ],
        showProperties: [
          'name', 'code', 'region', 'flag',
          'hasOfficialDealer', 'dealerCount', 'isActive',
          'createdAt', 'updatedAt'
        ],
      },
    },

  ],

  branding: {
    companyName: 'BYD Dealer Admin',
    softwareBrothers: false,
  },

  rootPath: '/admin',
});

// ✅ connect-mongo v4 session store
const sessionStore = connectMongo.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'adminSessions',
  ttl: 86400,
});

// ─── Protected login router ─────────────────────────────
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      if (email === process.env.ADMIN_EMAIL) {
        const passwordMatch = await bcrypt.compare(
          password,
          process.env.ADMIN_PASSWORD_HASH
        );
        console.log('Password match result:', passwordMatch);
        if (passwordMatch) {
          return { email: process.env.ADMIN_EMAIL, role: 'admin' };
        }
      }
      return null;
    },
    cookieName: 'byd-admin-session',
    cookiePassword: process.env.SESSION_SECRET,
  },
  null,
  {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000,
    },
  }
);

module.exports = { adminJs, adminRouter, allowedOrigins };