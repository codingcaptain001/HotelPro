const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomType: { type: String, required: true },
  description: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true },
  amenities: [String],
  images: [String],
  status: { type: String, enum: ['available', 'maintenance'], default: 'available' }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
