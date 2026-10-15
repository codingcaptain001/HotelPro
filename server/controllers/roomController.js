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

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    const { name, roomType, description, pricePerNight, capacity, amenities, images, status } = req.body;
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    if (name !== undefined) room.name = name;
    if (roomType !== undefined) room.roomType = roomType;
    if (description !== undefined) room.description = description;
    if (pricePerNight !== undefined) {
      if (pricePerNight < 0) {
        res.status(400);
        throw new Error('Price cannot be negative');
      }
      room.pricePerNight = pricePerNight;
      room.rentPerDay = pricePerNight;
    }
    if (capacity !== undefined) {
      if (capacity < 1) {
        res.status(400);
        throw new Error('Capacity must be at least 1');
      }
      room.capacity = capacity;
      room.maxCount = capacity;
    }
    if (amenities !== undefined) room.amenities = amenities;
    if (images !== undefined) {
      room.images = images;
      room.photos = images;
    }
    if (status !== undefined) room.status = status;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      res.status(404);
      throw new Error('Room not found');
    }

    await Room.deleteOne({ _id: req.params.id });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRooms, getRoomById, createRoom, updateRoom, deleteRoom };

