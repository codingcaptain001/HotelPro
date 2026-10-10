const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingReference: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  room: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guestCount: { type: Number, required: true },
  numberOfNights: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
