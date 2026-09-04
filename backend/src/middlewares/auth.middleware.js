/**
 * @fileoverview Authentication Middleware
 * Verifies the JWT token provided in the Authorization header.
 */

const jwt = require('jsonwebtoken');

/**
 * @desc    Middleware to verify JWT token and attach user info to request object
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Next middleware function
 */
const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header (Format: Bearer <token>)
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data (ID and Role) to the request object for use in subsequent controllers
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (err) {
    // Handle invalid or expired tokens
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
