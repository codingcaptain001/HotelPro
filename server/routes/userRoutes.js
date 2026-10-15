const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getAllUsers);

router.route('/:id/role')
  .put(protect, admin, updateUserRole);

module.exports = router;
