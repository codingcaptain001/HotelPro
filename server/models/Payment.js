const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingReference: { 
    type: String, 
    required: [true, 'Booking reference is required'],
    trim: true,
    uppercase: true,
    index: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  gateway: { 
    type: String, 
    default: 'razorpay-test',
    trim: true 
  },
  transactionReference: { 
    type: String,
    trim: true,
    sparse: true,
    index: true 
  },
  amount: { 
    type: Number, 
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },
  currency: { 
    type: String, 
    default: 'USD',
    uppercase: true,
    trim: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending' 
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
