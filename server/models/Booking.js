const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingReference: { 
    type: String, 
    required: [true, 'Booking reference is required'], 
    unique: true,
    uppercase: true,
    trim: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: [true, 'User reference is required'], 
    ref: 'User' 
  },
  room: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: [true, 'Room reference is required'], 
    ref: 'Room' 
  },
  checkInDate: { 
    type: Date, 
    required: [true, 'Check-in date is required'] 
  },
  checkOutDate: { 
    type: Date, 
    required: [true, 'Check-out date is required'] 
  },
  guestCount: { 
    type: Number, 
    required: [true, 'Guest count is required'],
    min: [1, 'Guest count must be at least 1']
  },
  numberOfNights: { 
    type: Number, 
    required: [true, 'Number of nights is required'],
    min: [1, 'Number of nights must be at least 1']
  },
  totalAmount: { 
    type: Number, 
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  bookingStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Compound index for booking overlap checks
bookingSchema.index({ room: 1, bookingStatus: 1, checkInDate: 1, checkOutDate: 1 });
// Index for guest booking history lookups
bookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
