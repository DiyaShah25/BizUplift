/**
 * controllers/userController.js
 * Get and update user profiles.
 */
const User = require('../models/User');

// GET /api/users/profile  (protected — get own profile from token)
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) { next(err); }
};

// GET /api/users/:id
const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) { next(err); }
};

// PUT /api/users/:id  (protected — own profile or admin)
const updateUser = async (req, res, next) => {
    try {
        const { name, mobile, avatar } = req.body;

        // Only allow updating own profile unless admin
        if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin')
            return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, mobile, avatar },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) { next(err); }
};

// PUT /api/users/profile  (protected — update own profile from token)
const updateProfile = async (req, res, next) => {
    try {
        const { name, mobile, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, mobile, avatar },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) { next(err); }
};

module.exports = { getProfile, getUser, updateUser, updateProfile };
