/**
 * @fileoverview Admin Controller
 * Provides administrative functions for managing receipts and viewing system stats.
 */

const prisma = require('../utils/prisma');
const { z } = require('zod');

// --- Input Validation Schemas ---

const statusUpdateSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  rejectionReason: z.string().optional()
});

/**
 * @desc    Get all receipts submitted by all users
 * @route   GET /api/admin/receipts
 * @access  Protected (Admin)
 * @returns {Array} 200 - List of all receipts with basic user details
 */
exports.getAllReceipts = async (req, res, next) => {
  try {
    const receipts = await prisma.receipt.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(receipts);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve or reject a receipt and issue vouchers
 * @route   PATCH /api/admin/receipts/:id/status
 * @access  Protected (Admin)
 * @param   {string} req.params.id - The ID of the receipt to update
 * @param   {Object} req.body - Object containing status and optional rejectionReason
 * @returns {Object} 200 - Updated receipt and generated voucher (if approved)
 * @returns {Object} 400 - Validation error or idempotent check failure
 * @returns {Object} 404 - Receipt not found
 */
exports.updateReceiptStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Step 1: Validate request body
    const { status, rejectionReason } = statusUpdateSchema.parse(req.body);

    // Step 2: Check if receipt exists
    const receipt = await prisma.receipt.findUnique({
      where: { id: parseInt(id) }
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Step 3: Enforce idempotency - prevent re-approval
    if (receipt.status === 'APPROVED') {
      return res.status(400).json({ message: 'Receipt is already approved and voucher generated' });
    }

    // Step 4: Execute updates inside a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 4.1 Update receipt status
      const updatedReceipt = await tx.receipt.update({
        where: { id: parseInt(id) },
        data: {
          status,
          rejectionReason: status === 'REJECTED' ? rejectionReason : null
        }
      });

      let voucher = null;
      // 4.2 If APPROVED, generate and save a new voucher
      if (status === 'APPROVED') {
        const voucherCode = `VOUCHER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        voucher = await tx.voucher.create({
          data: {
            code: voucherCode,
            userId: receipt.userId,
            receiptId: receipt.id
          }
        });
      }

      return { updatedReceipt, voucher };
    });

    res.json({
      message: `Receipt ${status.toLowerCase()} successfully`,
      ...result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

/**
 * @desc    Get system-wide statistics for the admin dashboard
 * @route   GET /api/admin/dashboard
 * @access  Protected (Admin)
 * @returns {Object} 200 - Counts for receipts and vouchers
 */
exports.getAdminDashboard = async (req, res, next) => {
  try {
    // Run counts in parallel for performance
    const [pendingCount, approvedCount, rejectedCount, voucherCount] = await Promise.all([
      prisma.receipt.count({ where: { status: 'PENDING' } }),
      prisma.receipt.count({ where: { status: 'APPROVED' } }),
      prisma.receipt.count({ where: { status: 'REJECTED' } }),
      prisma.voucher.count()
    ]);

    res.json({
      pendingReceipts: pendingCount,
      approvedReceipts: approvedCount,
      rejectedReceipts: rejectedCount,
      totalVouchersIssued: voucherCount
    });
  } catch (error) {
    next(error);
  }
};
