/**
 * Authentication validators
 */
const {body} = require('express-validator');

/**
 * Login request validation rules
 */
exports.loginValidation = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isString().withMessage('Email must be a string')
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters'),

    body('isRemember')
        .optional()
        .isBoolean().withMessage('isRemember must be a boolean')
];