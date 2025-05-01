/**
 * Registration validators
 */
const {body} = require('express-validator');

/**
 * Registration request validation rules
 */
exports.registerValidation = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isString().withMessage('Username must be a string')
        .trim()
        .isLength({min: 3, max: 50}).withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Password must be a string')
        .isLength({min: 6}).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    body('confirmPassword')
        .notEmpty().withMessage('Password confirmation is required')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),

    body('fullName')
        .optional()
        .isString().withMessage('Full name must be a string')
        .trim()
        .isLength({max: 100}).withMessage('Full name must be at most 100 characters')
];