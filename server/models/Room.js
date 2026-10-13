const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a room name or number'],
    trim: true 
  },
  roomType: { 
    type: String, 
    required: [true, 'Please provide a room type'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Please provide a room description'],
    trim: true 
  },
  pricePerNight: { 
    type: Number, 
    required: [true, 'Please provide a nightly price'],
    min: [0, 'Price per night cannot be negative']
  },
  capacity: { 
    type: Number, 
    required: [true, 'Please provide room capacity'],
    min: [1, 'Capacity must be at least 1 guest']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  status: { 
    type: String, 
    enum: ['available', 'maintenance'], 
    default: 'available' 
  }
}, { timestamps: true });

// Compound index for querying available rooms and price sorting
roomSchema.index({ status: 1, pricePerNight: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
