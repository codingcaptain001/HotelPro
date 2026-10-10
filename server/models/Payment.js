const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingReference: { type: String, required: true },
  gateway: { type: String, default: 'razorpay-test' },
  transactionReference: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
