/**
 * @fileoverview Receipt Controller
 * Handles receipt submission and retrieval for authenticated users.
 */

const prisma = require('../utils/prisma');
const { z } = require('zod');

// --- Input Validation Schemas ---

const createReceiptSchema = z.object({
  orderId: z.string().min(1),
  // Transform string inputs from form-data to appropriate types
  purchaseDate: z.string().transform((str) => new Date(str)),
  amount: z.string().transform((str) => parseFloat(str))
});

/**
 * @desc    Submit a new receipt for verification
 * @route   POST /api/receipts
 * @access  Protected (User)
 * @param   {Object} req.body - Object containing orderId, purchaseDate, and amount
 * @param   {Object} req.file - Uploaded image file (Multer)
 * @returns {Object} 201 - Success message and created receipt object
 * @returns {Object} 400 - Validation error or duplicate order ID
 */
exports.submitReceipt = async (req, res, next) => {
  try {
    // Step 1: Ensure image file is present
    if (!req.file) {
      return res.status(400).json({ message: 'Receipt image is required' });
    }

    // Step 2: Validate body fields
    const { orderId, purchaseDate, amount } = createReceiptSchema.parse(req.body);

    // Step 3: Check for duplicate Order IDs
    const existingReceipt = await prisma.receipt.findUnique({
      where: { orderId }
    });

    if (existingReceipt) {
      return res.status(400).json({ message: 'Receipt with this Order ID already exists' });
    }

    // Step 4: Create receipt record in database
    const receipt = await prisma.receipt.create({
      data: {
        userId: req.user.id, // Linked to the authenticated user
        orderId,
        purchaseDate,
        amount,
        imageUrl: req.file.filename, // Store filename, path handled by static serving
        status: 'PENDING' // Default status
      }
    });

    res.status(201).json({
      message: 'Receipt submitted successfully',
      receipt
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

/**
 * @desc    Get all receipts submitted by the logged-in user
 * @route   GET /api/receipts/my
 * @access  Protected (User)
 * @returns {Array} 200 - List of user's receipts
 */
exports.getMyReceipts = async (req, res, next) => {
  try {
    const receipts = await prisma.receipt.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(receipts);
  } catch (error) {
    next(error);
  }
};
