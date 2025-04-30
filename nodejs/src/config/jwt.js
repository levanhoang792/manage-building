/**
 * JWT configuration
 */
require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'your-secret-key-should-be-in-env-file',
  expiresIn: '1d', // Token expires in 1 day
  extendedExpiresIn: '30d', // Extended token expiration for "Remember me" (30 days)
  issuer: 'building-management-api',
  audience: 'building-management-client'
};