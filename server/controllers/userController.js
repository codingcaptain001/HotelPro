const User = require('../models/User');

// @desc    Get all registered users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['guest', 'admin'].includes(role)) {
      res.status(400);
      throw new Error('Role must be either guest or admin');
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.role = role;
    user.isAdmin = role === 'admin';
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isAdmin: updatedUser.isAdmin,
      phone: updatedUser.phone
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateUserRole };

