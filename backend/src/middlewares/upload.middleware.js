/**
 * @fileoverview Multer File Upload Middleware Configuration
 * Configures storage, file size limits, and filters for receipt image uploads.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  // Step 1: Define destination folder for uploaded files
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  // Step 2: Define a unique filename for the uploaded file
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

/**
 * @desc    Filter to ensure only image files are uploaded
 */
const fileFilter = (req, file, cb) => {
  // Define allowed extensions
  const extname = path.extname(file.originalname).toLowerCase();
  const isExtAllowed = ['.jpg', '.jpeg', '.png'].includes(extname);

  // Define allowed mime-types
  // compatible the web application (image/*) and testing software like postman (application/octet-stream)
  const isMimeAllowed = file.mimetype.startsWith('image/') || file.mimetype === 'application/octet-stream';

  if (isExtAllowed && isMimeAllowed) {
    return cb(null, true);
  }
  // Reject if not an allowed image type
  cb(new Error('Only image files (jpeg, jpg, png) are allowed!'));
};

// --- Multer Initialization ---
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter: fileFilter
});

module.exports = upload;
