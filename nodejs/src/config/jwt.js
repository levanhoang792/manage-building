/**
 * JWT configuration
 */
require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'your-secret-key-should-be-in-env-file',
  expiresIn: '1d', // Token expires in 1 day
  issuer: 'building-management-api',
  audience: 'building-management-client'
};