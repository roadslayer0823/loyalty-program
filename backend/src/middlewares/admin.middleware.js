/**
 * @fileoverview Admin Authorization Middleware
 * Restricts access to routes based on user role.
 */

/**
 * @desc    Middleware to check if the authenticated user has ADMIN privileges
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Next middleware function
 */
const adminMiddleware = (req, res, next) => {
  // Check if req.user exists and has the 'ADMIN' role
  // req.user is populated by the authMiddleware
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }

  // Proceed if user is an admin
  next();
};

module.exports = adminMiddleware;
