/**
 * Role validators
 */
const { body, param } = require('express-validator');

/**
 * Validate create role request
 */
exports.validateCreateRole = [
    body('name')
        .notEmpty().withMessage('Role name is required')
        .isLength({ min: 3 }).withMessage('Role name must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Role name can only contain letters, numbers, and underscores'),
    
    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
];

/**
 * Validate update role request
 */
exports.validateUpdateRole = [
    param('id')
        .isInt().withMessage('Role ID must be an integer'),
    
    body('name')
        .notEmpty().withMessage('Role name is required')
        .isLength({ min: 3 }).withMessage('Role name must be at least 3 characters long')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Role name can only contain letters, numbers, and underscores'),
    
    body('description')
        .optional()
        .isString().withMessage('Description must be a string')
];

/**
 * Validate role ID parameter
 */
exports.validateRoleId = [
    param('id')
        .isInt().withMessage('Role ID must be an integer')
];

/**
 * Validate assign role permissions request
 */
exports.validateAssignRolePermissions = [
    param('id')
        .isInt().withMessage('Role ID must be an integer'),
    
    body('permissionIds')
        .isArray().withMessage('Permission IDs must be an array')
        .notEmpty().withMessage('At least one permission must be assigned')
];

/**
 * Validate remove role permission request
 */
exports.validateRemoveRolePermission = [
    param('id')
        .isInt().withMessage('Role ID must be an integer'),
    
    param('permissionId')
        .isInt().withMessage('Permission ID must be an integer')
];