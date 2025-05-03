/**
 * User validators
 */
const { body, param, query } = require('express-validator');

/**
 * Validate create user request
 */
exports.validateCreateUser = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    
    body('fullName')
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters long'),
    
    body('phone')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number format'),
    
    body('roles')
        .isArray().withMessage('Roles must be an array')
        .notEmpty().withMessage('At least one role must be assigned')
];

/**
 * Validate update user request
 */
exports.validateUpdateUser = [
    param('id')
        .isInt().withMessage('User ID must be an integer'),
    
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    
    body('fullName')
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2 }).withMessage('Full name must be at least 2 characters long'),
    
    body('phone')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number format'),
    
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean'),
    
    body('roles')
        .isArray().withMessage('Roles must be an array')
        .notEmpty().withMessage('At least one role must be assigned')
];

/**
 * Validate user ID parameter
 */
exports.validateUserId = [
    param('id')
        .isInt().withMessage('User ID must be an integer')
];

/**
 * Validate user approval request
 */
exports.validateUserApproval = [
    param('id')
        .isInt().withMessage('User ID must be an integer'),
    
    body('comment')
        .optional()
        .isString().withMessage('Comment must be a string')
];

/**
 * Validate user rejection request
 */
exports.validateUserRejection = [
    param('id')
        .isInt().withMessage('User ID must be an integer'),
    
    body('comment')
        .notEmpty().withMessage('Rejection reason is required')
        .isString().withMessage('Comment must be a string')
];

/**
 * Validate assign user roles request
 */
exports.validateAssignUserRoles = [
    param('id')
        .isInt().withMessage('User ID must be an integer'),
    
    body('roleIds')
        .isArray().withMessage('Role IDs must be an array')
        .notEmpty().withMessage('At least one role must be assigned')
];

/**
 * Validate remove user role request
 */
exports.validateRemoveUserRole = [
    param('id')
        .isInt().withMessage('User ID must be an integer'),
    
    param('roleId')
        .isInt().withMessage('Role ID must be an integer')
];