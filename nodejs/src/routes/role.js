/**
 * Role routes
 */
const express = require('express');
const router = express.Router();
const roleController = require('@src/controllers/role.controller');
const roleValidator = require('@src/middleware/validators/role.validator');
const authMiddleware = require('@src/middleware/auth.middleware');
const permissionMiddleware = require('@src/middleware/permission.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware.verifyToken);

// Get all roles
router.get(
    '/',
    permissionMiddleware.hasPermission('role.view'),
    roleController.getAllRoles
);

// Get role by ID
router.get(
    '/:id',
    roleValidator.validateRoleId,
    permissionMiddleware.hasPermission('role.view'),
    roleController.getRoleById
);

// Create role
router.post(
    '/',
    roleValidator.validateCreateRole,
    permissionMiddleware.hasPermission('role.create'),
    roleController.createRole
);

// Update role
router.put(
    '/:id',
    roleValidator.validateUpdateRole,
    permissionMiddleware.hasPermission('role.edit'),
    roleController.updateRole
);

// Delete role
router.delete(
    '/:id',
    roleValidator.validateRoleId,
    permissionMiddleware.hasPermission('role.delete'),
    roleController.deleteRole
);

// Get role permissions
router.get(
    '/:id/permissions',
    roleValidator.validateRoleId,
    permissionMiddleware.hasPermission('role.view'),
    roleController.getRolePermissions
);

// Assign permissions to role
router.post(
    '/:id/permissions',
    roleValidator.validateAssignRolePermissions,
    permissionMiddleware.hasPermission('role.edit'),
    roleController.assignRolePermissions
);

// Remove permission from role
router.delete(
    '/:id/permissions/:permissionId',
    roleValidator.validateRemoveRolePermission,
    permissionMiddleware.hasPermission('role.edit'),
    roleController.removeRolePermission
);

module.exports = router;