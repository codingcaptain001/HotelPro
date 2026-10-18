const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  registerAdmin, 
  authUser, 
  logoutUser, 
  getUserProfile 
} = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/admin/register', registerAdmin);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
