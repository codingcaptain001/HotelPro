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
  bookingType: {
    type: String,
    enum: ['standard', 'deluxe', 'suite', 'online', 'walk-in', 'direct'],
    default: 'online'
  },
  guestName: {
    type: String,
    trim: true
  },
  customerName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
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
  totalDays: {
    type: Number,
    min: [1, 'Total days must be at least 1']
  },
  totalAmount: { 
    type: Number, 
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  amount: {
    type: Number,
    min: [0, 'Amount cannot be negative']
  },
  bookingStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded'], 
    default: 'pending' 
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  transactionId: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Pre-save synchronization for alias/compatibility fields
bookingSchema.pre('save', function (next) {
  if (this.amount === undefined && this.totalAmount !== undefined) {
    this.amount = this.totalAmount;
  }
  if (this.totalAmount === undefined && this.amount !== undefined) {
    this.totalAmount = this.amount;
  }
  if (this.totalDays === undefined && this.numberOfNights !== undefined) {
    this.totalDays = this.numberOfNights;
  }
  if (this.numberOfNights === undefined && this.totalDays !== undefined) {
    this.numberOfNights = this.totalDays;
  }
  if (!this.status && this.bookingStatus) {
    this.status = this.bookingStatus;
  }
  if (!this.bookingStatus && this.status) {
    this.bookingStatus = this.status;
  }
  if (typeof next === 'function') {
    next();
  }
});

// Compound index for booking overlap checks
bookingSchema.index({ room: 1, bookingStatus: 1, checkInDate: 1, checkOutDate: 1 });
// Index for guest booking history lookups
bookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
