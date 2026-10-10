const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom } = require('../controllers/roomController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getRooms).post(protect, admin, createRoom);
router.route('/:id').get(getRoomById);

module.exports = router;
