const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

const seedGuest = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    const guestEmail = 'guest@hotelpro.com';
    const guestPassword = 'guest123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(guestPassword, salt);

    let guestUser = await User.findOne({ email: guestEmail });

    if (!guestUser) {
      guestUser = await User.create({
        name: 'Demo Guest',
        email: guestEmail,
        passwordHash,
        role: 'guest',
        isAdmin: false,
        phone: '+1 (555) 019-2834'
      });
      console.log(`Created demo guest user: ${guestEmail} (password: ${guestPassword})`);
    } else {
      guestUser.name = 'Demo Guest';
      guestUser.passwordHash = passwordHash;
      guestUser.role = 'guest';
      guestUser.isAdmin = false;
      guestUser.phone = '+1 (555) 019-2834';
      await guestUser.save();
      console.log(`Updated demo guest user: ${guestEmail} with password ${guestPassword}`);
    }

    // Also check if guest has at least one active booking for a great first-time dashboard experience
    const existingBooking = await Booking.findOne({ user: guestUser._id });
    if (!existingBooking) {
      const room = await Room.findOne({ status: 'available' });
      if (room) {
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + 3);
        const checkOut = new Date();
        checkOut.setDate(checkOut.getDate() + 6);
        const numberOfNights = 3;
        const totalPrice = room.pricePerNight * numberOfNights;

        const bookingRef = 'BK-' + Date.now().toString(36).toUpperCase() + '-GST';
        await Booking.create({
          bookingReference: bookingRef,
          user: guestUser._id,
          room: room._id,
          bookingType: 'online',
          guestName: guestUser.name,
          customerName: guestUser.name,
          email: guestUser.email,
          phone: guestUser.phone,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          guestCount: 2,
          numberOfNights,
          totalPrice,
          totalAmount: totalPrice,
          bookingStatus: 'confirmed',
          status: 'confirmed',
          paymentStatus: 'paid'
        });
        console.log(`Created sample confirmed booking ${bookingRef} for room "${room.name}"`);
      }
    }

    console.log('Demo guest seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding demo guest user:', error);
    process.exit(1);
  }
};

seedGuest();
