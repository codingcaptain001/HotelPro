const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  cancelBooking, 
  getAllBookings, 
  updateBookingStatus 
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.route('/my').get(protect, getMyBookings);
router.route('/:id/cancel').put(protect, cancelBooking);
router.route('/:id/status').put(protect, admin, updateBookingStatus);


module.exports = router;
