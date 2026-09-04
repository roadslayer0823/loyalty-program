/**
 * @fileoverview Administrative Routes
 * Mounted under /api/admin
 * All routes in this file require ADMIN privileges.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Apply authentication and admin role checks to all routes in this router
router.use(authMiddleware, adminMiddleware);

// @route   GET /api/admin/receipts
// @desc    Get all receipts in the system
// @access  Protected (Admin)
router.get('/receipts', adminController.getAllReceipts);

// @route   PATCH /api/admin/receipts/:id/status
// @desc    Approve or reject a specific receipt
// @access  Protected (Admin)
router.patch('/receipts/:id/status', adminController.updateReceiptStatus);

// @route   GET /api/admin/dashboard
// @desc    Get system-wide stats
// @access  Protected (Admin)
router.get('/dashboard', adminController.getAdminDashboard);

module.exports = router;
