/**
 * @fileoverview Receipt Management Routes
 * Mounted under /api/receipts
 */

const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receipt.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// @route   POST /api/receipts
// @desc    Submit a new receipt with an image
// @access  Protected (User)
router.post('/', authMiddleware, upload.single('image'), receiptController.submitReceipt);

// @route   GET /api/receipts/my
// @desc    Retrieve all receipts for the logged-in user
// @access  Protected (User)
router.get('/my', authMiddleware, receiptController.getMyReceipts);

module.exports = router;
