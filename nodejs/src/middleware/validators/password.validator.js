/**
 * Password validators
 */
const {body} = require('express-validator');

/**
 * Change password validation rules
 */
exports.changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required')
        .isString().withMessage('Current password must be a string'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isString().withMessage('New password must be a string')
        .isLength({min: 6}).withMessage('New password must be at least 6 characters'),

    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required')
        .isString().withMessage('Confirm password must be a string')
        .custom((value, {req}) => {
            if (value !== req.body.newPassword) {
                throw new Error('Confirm password must match new password');
            }
            return true;
        })
];