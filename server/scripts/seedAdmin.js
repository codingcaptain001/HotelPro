require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // 1. Promote any existing user with lakshyanamdev001@gmail.com to admin
    const lakshya = await User.findOne({ email: 'lakshyanamdev001@gmail.com' });
    if (lakshya) {
      lakshya.role = 'admin';
      lakshya.isAdmin = true;
      await lakshya.save();
      console.log(`Promoted ${lakshya.email} to Administrator!`);
    }

    // 2. Also ensure a dedicated admin account admin@hotelpro.com exists
    const adminEmail = 'admin@hotelpro.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      adminUser = await User.create({
        name: 'HotelPro Administrator',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isAdmin: true,
        phone: '+1 (800) 555-0199'
      });
      console.log(`Created default administrator: ${adminEmail} (password: admin123)`);
    } else {
      adminUser.role = 'admin';
      adminUser.isAdmin = true;
      await adminUser.save();
      console.log(`Administrator ${adminEmail} verified.`);
    }

    console.log('Admin seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
