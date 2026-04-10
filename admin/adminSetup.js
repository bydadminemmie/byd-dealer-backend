const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSMongoose = require('@adminjs/mongoose');
const bcrypt = require('bcrypt');

// All four models
const Dealer   = require('../models/Dealer');
const Vehicle  = require('../models/Vehicle');
const EVClub   = require('../models/EVClub');
const Country  = require('../models/Country');

AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({

  resources: [

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

// ─── Protected login router ────────────────────────────────────────────────
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      // Debug logs — remove these after login is working
      console.log('Login attempt with email:', email);
      console.log('Expected email:', process.env.ADMIN_EMAIL);
      console.log('Hash exists:', !!process.env.ADMIN_PASSWORD_HASH);

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
    resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    maxAge: 86400000, // 24 hours
  },
  }
);

module.exports = { adminJs, adminRouter };