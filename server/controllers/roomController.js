const Room = require('../models/Room');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      res.json(room);
    } else {
      res.status(404);
      throw new Error('Room not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const { name, roomType, description, pricePerNight, capacity, amenities, images } = req.body;

    const room = new Room({
      name,
      roomType,
      description,
      pricePerNight,
      capacity,
      amenities,
      images,
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    next(error);
  }
};

module.exports = { getRooms, getRoomById, createRoom };
