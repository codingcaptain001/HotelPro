const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createBooking);
router.route('/my').get(protect, getMyBookings);

module.exports = router;
