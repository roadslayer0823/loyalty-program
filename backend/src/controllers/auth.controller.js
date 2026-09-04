/**
 * @fileoverview Authentication Controller
 * Handles user registration, login, and JWT token issuance.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const { z } = require('zod');

// --- Input Validation Schemas ---

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  phone: z.string().min(8, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name is required')
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or Phone number is required'),
  password: z.string().min(1, 'Password is required')
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * @param   {Object} req.body - Object containing email, phone, password, name
 * @returns {Object} 201 - Success message and user ID
 * @returns {Object} 400 - Validation error or user already exists
 */
exports.register = async (req, res, next) => {
  try {
    // Step 1: Validate input data
    const { email, phone, password, name } = registerSchema.parse(req.body);

    // Step 2: Check if email or phone already exists
    const existingConditions = [{ email }];
    if (phone) {
      existingConditions.push({ phone });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: existingConditions
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Step 3: Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Step 4: Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        phone: phone || null,
        passwordHash,
        name,
        role: 'USER' // Default role
      }
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user.id
    });
  } catch (error) {
    // Handle validation errors from Zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

/**
 * @desc    Authenticate user and return JWT
 * @route   POST /api/auth/login
 * @access  Public
 * @param   {Object} req.body - Object containing email and password
 * @returns {Object} 200 - Authentication token and basic user info
 * @returns {Object} 401 - Invalid credentials
 */
exports.login = async (req, res, next) => {
  try {
    // Step 1: Validate input data
    const { identifier, password } = loginSchema.parse(req.body);

    // Step 2: Find user by EITHER email OR phone number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Email or phone number not found.' });
    }

    // Step 3: Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    // Step 4: Sign JWT containing userId and role
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};
