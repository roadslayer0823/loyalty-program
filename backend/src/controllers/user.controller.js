/**
 * @fileoverview User Controller
 * Handles user-specific data retrieval and profile management.
 */

const prisma = require('../utils/prisma');
const { z } = require('zod');

// --- Input Validation Schemas ---

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

/**
 * @desc    Get user-specific dashboard statistics
 * @route   GET /api/users/dashboard
 * @access  Protected (User)
 * @returns {Object} 200 - Counts for user's pending/approved receipts and vouchers
 */
exports.getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Parallel processing for performance
    const [pendingCount, approvedCount, voucherCount] = await Promise.all([
      prisma.receipt.count({ where: { userId, status: 'PENDING' } }),
      prisma.receipt.count({ where: { userId, status: 'APPROVED' } }),
      prisma.voucher.count({ where: { userId } })
    ]);

    res.json({
      pendingReceipts: pendingCount,
      approvedReceipts: approvedCount,
      availableVouchers: voucherCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all vouchers issued to the logged-in user
 * @route   GET /api/users/vouchers
 * @access  Protected (User)
 * @returns {Array} 200 - List of user's vouchers with linked receipt details
 */
exports.getUserVouchers = async (req, res, next) => {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: { userId: req.user.id },
      include: {
        receipt: {
          select: {
            orderId: true,
            purchaseDate: true,
            amount: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(vouchers);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile information
 * @route   PUT /api/users/profile
 * @access  Protected (User)
 * @param   {Object} req.body - Object containing updated name, email, or phone
 * @returns {Object} 200 - Success message and updated user info
 * @returns {Object} 400 - Validation error or email conflict
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Step 1: Validate input
    const data = profileUpdateSchema.parse(req.body);

    // Step 2: Check for email availability if email is being updated
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: userId }
        }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Step 3: Update user record
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};
