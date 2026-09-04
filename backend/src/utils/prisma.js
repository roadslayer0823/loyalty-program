/**
 * @fileoverview Prisma Client Singleton
 * This utility ensures a single instance of PrismaClient is used throughout the application
 * to manage database connections efficiently.
 */

const { PrismaClient } = require('@prisma/client');

// Initialize the Prisma Client
const prisma = new PrismaClient();

module.exports = prisma;
