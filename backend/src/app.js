/**
 * @fileoverview Main entry point for the Loyalty Program Backend API.
 * Configures Express, middleware, routes, and error handling.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Global Middleware ---

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Route Definitions ---

const authRoutes = require('./routes/auth.routes');
const receiptRoutes = require('./routes/receipt.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes');

// Mount routes
app.use('/api/auth', authRoutes);      // Authentication & Registration
app.use('/api/receipts', receiptRoutes); // Receipt Submissions
app.use('/api/admin', adminRoutes);    // Admin Management & Dashboard
app.use('/api/users', userRoutes);     // User Profile & Personal Dashboard

/**
 * @desc    Health check route to verify API status
 * @route   GET /
 * @access  Public
 */
app.get('/', (req, res) => {
  res.send('Loyalty Program API is running...');
});

/**
 * @desc    Global Error Handling Middleware
 * Catch-all for any unhandled errors in the application.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    // Show detailed error message only in development mode
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
