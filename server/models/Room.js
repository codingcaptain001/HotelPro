const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a room name or number'],
    trim: true 
  },
  roomNumber: {
    type: String,
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
  rentPerDay: {
    type: Number,
    min: [0, 'Rent per day cannot be negative']
  },
  capacity: { 
    type: Number, 
    required: [true, 'Please provide room capacity'],
    min: [1, 'Capacity must be at least 1 guest']
  },
  maxCount: {
    type: Number,
    min: [1, 'Max count must be at least 1']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  photos: [{
    type: String,
    trim: true
  }],
  currentBookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  status: { 
    type: String, 
    enum: ['available', 'maintenance'], 
    default: 'available' 
  }
}, { timestamps: true });

// Pre-save synchronization for alias/compatibility fields
roomSchema.pre('save', function (next) {
  if (!this.roomNumber && this.name) {
    this.roomNumber = this.name;
  }
  if (this.rentPerDay === undefined && this.pricePerNight !== undefined) {
    this.rentPerDay = this.pricePerNight;
  }
  if (this.pricePerNight === undefined && this.rentPerDay !== undefined) {
    this.pricePerNight = this.rentPerDay;
  }
  if (this.maxCount === undefined && this.capacity !== undefined) {
    this.maxCount = this.capacity;
  }
  if (this.capacity === undefined && this.maxCount !== undefined) {
    this.capacity = this.maxCount;
  }
  if ((!this.photos || this.photos.length === 0) && this.images && this.images.length > 0) {
    this.photos = [...this.images];
  }
  if ((!this.images || this.images.length === 0) && this.photos && this.photos.length > 0) {
    this.images = [...this.photos];
  }
  next();
});

// Compound index for querying available rooms and price sorting
roomSchema.index({ status: 1, pricePerNight: 1 });
roomSchema.index({ roomNumber: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
