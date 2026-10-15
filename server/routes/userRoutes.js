const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getAllUsers);

module.exports = router;
