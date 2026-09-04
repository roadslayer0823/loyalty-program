/**
 * @fileoverview User Management & Personal Data Routes
 * Mounted under /api/users
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Apply authentication check to all routes in this router
router.use(authMiddleware);

// @route   GET /api/users/dashboard
// @desc    Get personal dashboard stats (receipt/voucher counts)
// @access  Protected (User)
router.get('/dashboard', userController.getUserDashboard);

// @route   GET /api/users/vouchers
// @desc    Get all vouchers belonging to the user
// @access  Protected (User)
router.get('/vouchers', userController.getUserVouchers);

// @route   PUT /api/users/profile
// @desc    Update personal profile information
// @access  Protected (User)
router.put('/profile', userController.updateProfile);

module.exports = router;
