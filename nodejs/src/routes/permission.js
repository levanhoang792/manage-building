/**
 * Permission routes
 */
const express = require('express');
const router = express.Router();
const permissionController = require('@src/controllers/permission.controller');
const authMiddleware = require('@src/middleware/auth.middleware');
const permissionMiddleware = require('@src/middleware/permission.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware.verifyToken);

// Get all permissions
router.get(
    '/',
    // permissionMiddleware.hasPermission('permission:read'),
    permissionController.getAllPermissions
);

// Get permission by ID
router.get(
    '/:id',
    // permissionMiddleware.hasPermission('permission:read'),
    permissionController.getPermissionById
);

// Get roles with permission
router.get(
    '/:id/roles',
    // permissionMiddleware.hasPermission('permission:read'),
    permissionController.getRolesWithPermission
);

module.exports = router;