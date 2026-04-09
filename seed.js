const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Dealer = require('./models/Dealer');

const dealers = [
  {
    dealerId: 'BYD-NG-001',
    name: 'BYD Lagos Motors',
    country: 'Nigeria',
    city: 'Lagos',
    region: 'Africa',
    flag: '🇳🇬',
    stockCount: 45,
    stockLevel: 'High',
    rating: 4.7,
    yearsActive: 3,
    address: '14 Ozumba Mbadiwe Ave, Victoria Island, Lagos',
    phone: '+234 801 234 5678',
    email: 'info@bydlagos.com',
    website: 'https://bydlagos.com',
    modelsAvailable: ['Atto 3', 'Seal', 'Dolphin'],
    certified: true
  },
  {
    dealerId: 'BYD-ZA-001',
    name: 'BYD Cape Town',
    country: 'South Africa',
    city: 'Cape Town',
    region: 'Africa',
    flag: '🇿🇦',
    stockCount: 30,
    stockLevel: 'Mid',
    rating: 4.5,
    yearsActive: 2,
    address: '23 Buitenkant St, Cape Town City Centre',
    phone: '+27 21 987 6543',
    email: 'sales@bydcapetown.co.za',
    website: 'https://bydcapetown.co.za',
    modelsAvailable: ['Atto 3', 'Tang'],
    certified: true
  },
  {
    dealerId: 'BYD-UK-001',
    name: 'BYD London',
    country: 'United Kingdom',
    city: 'London',
    region: 'Europe',
    flag: '🇬🇧',
    stockCount: 60,
    stockLevel: 'High',
    rating: 4.8,
    yearsActive: 4,
    address: '10 Park Lane, Mayfair, London W1K 1QA',
    phone: '+44 20 7946 0321',
    email: 'info@bydlondon.co.uk',
    website: 'https://bydlondon.co.uk',
    modelsAvailable: ['Atto 3', 'Seal', 'Han', 'Tang'],
    certified: true
  },
  {
    dealerId: 'BYD-DE-001',
    name: 'BYD Berlin',
    country: 'Germany',
    city: 'Berlin',
    region: 'Europe',
    flag: '🇩🇪',
    stockCount: 20,
    stockLevel: 'Low',
    rating: 4.3,
    yearsActive: 2,
    address: 'Unter den Linden 21, 10117 Berlin',
    phone: '+49 30 1234 5678',
    email: 'info@bydberlin.de',
    website: 'https://bydberlin.de',
    modelsAvailable: ['Atto 3', 'Seal'],
    certified: false
  },
  {
    dealerId: 'BYD-CN-001',
    name: 'BYD Shanghai Flagship',
    country: 'China',
    city: 'Shanghai',
    region: 'Asia',
    flag: '🇨🇳',
    stockCount: 120,
    stockLevel: 'High',
    rating: 4.9,
    yearsActive: 8,
    address: '500 Nanjing East Road, Huangpu District, Shanghai',
    phone: '+86 21 6789 0123',
    email: 'flagship@bydshanghai.cn',
    website: 'https://bydshanghai.cn',
    modelsAvailable: ['Han', 'Tang', 'Seal', 'Atto 3', 'Dolphin', 'Seagull'],
    certified: true
  },
  {
    dealerId: 'BYD-AU-001',
    name: 'BYD Sydney',
    country: 'Australia',
    city: 'Sydney',
    region: 'Oceania',
    flag: '🇦🇺',
    stockCount: 35,
    stockLevel: 'Mid',
    rating: 4.6,
    yearsActive: 2,
    address: '88 George Street, Parramatta NSW 2150',
    phone: '+61 2 9876 5432',
    email: 'info@bydsydney.com.au',
    website: 'https://bydsydney.com.au',
    modelsAvailable: ['Atto 3', 'Seal', 'Dolphin'],
    certified: true
  },
  {
    dealerId: 'BYD-US-001',
    name: 'BYD Los Angeles',
    country: 'United States',
    city: 'Los Angeles',
    region: 'Americas',
    flag: '🇺🇸',
    stockCount: 50,
    stockLevel: 'High',
    rating: 4.5,
    yearsActive: 3,
    address: '3500 S Figueroa St, Los Angeles, CA 90007',
    phone: '+1 213 456 7890',
    email: 'sales@bydla.com',
    website: 'https://bydla.com',
    modelsAvailable: ['Atto 3', 'Han', 'Tang'],
    certified: true
  },
  {
    dealerId: 'BYD-AE-001',
    name: 'BYD Dubai',
    country: 'UAE',
    city: 'Dubai',
    region: 'Middle East',
    flag: '🇦🇪',
    stockCount: 75,
    stockLevel: 'High',
    rating: 4.8,
    yearsActive: 3,
    address: 'Sheikh Zayed Road, Al Quoz, Dubai',
    phone: '+971 4 321 9876',
    email: 'info@byddubai.ae',
    website: 'https://byddubai.ae',
    modelsAvailable: ['Han', 'Tang', 'Seal', 'Atto 3'],
    certified: true
  },
  {
    dealerId: 'BYD-BR-001',
    name: 'BYD São Paulo',
    country: 'Brazil',
    city: 'São Paulo',
    region: 'Americas',
    flag: '🇧🇷',
    stockCount: 18,
    stockLevel: 'Low',
    rating: 4.2,
    yearsActive: 1,
    address: 'Av. Paulista 1000, Bela Vista, São Paulo',
    phone: '+55 11 3456 7890',
    email: 'contato@bydbrasil.com.br',
    website: 'https://bydbrasil.com.br',
    modelsAvailable: ['Atto 3', 'Dolphin'],
    certified: false
  },
  {
    dealerId: 'BYD-JP-001',
    name: 'BYD Tokyo',
    country: 'Japan',
    city: 'Tokyo',
    region: 'Asia',
    flag: '🇯🇵',
    stockCount: 40,
    stockLevel: 'Mid',
    rating: 4.7,
    yearsActive: 2,
    address: '1-1 Shibuya, Shibuya-ku, Tokyo 150-0002',
    phone: '+81 3 1234 5678',
    email: 'info@bydtokyo.jp',
    website: 'https://bydtokyo.jp',
    modelsAvailable: ['Atto 3', 'Seal', 'Dolphin'],
    certified: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Dealer.deleteMany({});
    console.log('🗑️ Cleared existing dealers');

    await Dealer.insertMany(dealers);
    console.log('✅ Seeded 10 dealers successfully!');

    mongoose.connection.close();
    console.log('🔒 Connection closed');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();