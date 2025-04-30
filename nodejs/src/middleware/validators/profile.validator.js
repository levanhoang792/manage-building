/**
 * Profile validators
 */
const { body } = require('express-validator');

/**
 * Update profile validation rules
 */
exports.updateProfileValidation = [
  body('username')
    .optional()
    .isString().withMessage('Username must be a string')
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  
  body('email')
    .optional()
    .isString().withMessage('Email must be a string')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('fullName')
    .optional()
    .isString().withMessage('Full name must be a string')
    .trim()
    .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  
  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string')
    .trim()
];