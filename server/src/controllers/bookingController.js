const Booking = require('../models/Booking');
const Room = require('../models/Room');
const crypto = require('crypto');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { room: roomId, checkInDate, checkOutDate, guestCount } = req.body;
    
    // Convert strings to dates
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);

    // Validate dates
    if (inDate >= outDate) {
      res.status(400);
      throw new Error('Check-out date must be after check-in date');
    }

    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    if (guestCount > room.capacity) {
      res.status(400);
      throw new Error(`Room capacity is ${room.capacity}`);
    }

    // Check for double bookings
    const overlappingBookings = await Booking.find({
      room: roomId,
      bookingStatus: { $ne: 'cancelled' },
      $or: [
        { checkInDate: { $lt: outDate, $gte: inDate } },
        { checkOutDate: { $gt: inDate, $lte: outDate } },
        { checkInDate: { $lte: inDate }, checkOutDate: { $gte: outDate } }
      ]
    });

    if (overlappingBookings.length > 0) {
      res.status(400);
      throw new Error('Room is not available for these dates');
    }

    // Calculate nights and amount
    const nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * room.pricePerNight;
    
    const bookingReference = 'BKG-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const booking = new Booking({
      bookingReference,
      user: req.user._id,
      room: roomId,
      checkInDate: inDate,
      checkOutDate: outDate,
      guestCount,
      numberOfNights: nights,
      totalAmount
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('room', 'name roomType images');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Verify ownership or admin role
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to cancel this booking');
    }

    if (booking.bookingStatus === 'cancelled') {
      res.status(400);
      throw new Error('Booking is already cancelled');
    }
    
    // Convert to Date for comparison
    const inDate = new Date(booking.checkInDate);
    const today = new Date();
    
    if (inDate < today) {
        res.status(400);
        throw new Error('Cannot cancel a booking that has already started or completed');
    }

    booking.bookingStatus = 'cancelled';
    const updatedBooking = await booking.save();
    
    res.json(updatedBooking);
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };
