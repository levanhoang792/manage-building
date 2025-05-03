/**
 * User routes
 */
const express = require('express');
const router = express.Router();
const userController = require('@controllers/user.controller');
const userValidator = require('@middleware/validators/user.validator');
const authMiddleware = require('@middleware/auth.middleware');
const permissionMiddleware = require('@middleware/permission.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware.verifyToken);

// Get all users
router.get(
    '/',
    permissionMiddleware.hasPermission('user.view'),
    userController.getAllUsers
);

// Get pending users
router.get(
    '/pending',
    permissionMiddleware.hasPermission('user.approve'),
    userController.getPendingUsers
);

// Get user by ID
router.get(
    '/:id',
    userValidator.validateUserId,
    permissionMiddleware.hasPermission('user.view'),
    userController.getUserById
);

// Create user
router.post(
    '/',
    userValidator.validateCreateUser,
    permissionMiddleware.hasPermission('user.create'),
    userController.createUser
);

// Update user
router.put(
    '/:id',
    userValidator.validateUpdateUser,
    permissionMiddleware.hasPermission('user.edit'),
    userController.updateUser
);

// Delete user
router.delete(
    '/:id',
    userValidator.validateUserId,
    permissionMiddleware.hasPermission('user.delete'),
    userController.deleteUser
);

// Approve user
router.post(
    '/:id/approve',
    userValidator.validateUserApproval,
    permissionMiddleware.hasPermission('user.approve'),
    userController.approveUser
);

// Reject user
router.post(
    '/:id/reject',
    userValidator.validateUserRejection,
    permissionMiddleware.hasPermission('user.approve'),
    userController.rejectUser
);

// Get user roles
router.get(
    '/:id/roles',
    userValidator.validateUserId,
    permissionMiddleware.hasPermission('user.view'),
    userController.getUserRoles
);

// Assign roles to user
router.post(
    '/:id/roles',
    userValidator.validateAssignUserRoles,
    permissionMiddleware.hasPermission('user.edit'),
    userController.assignUserRoles
);

// Remove role from user
router.delete(
    '/:id/roles/:roleId',
    userValidator.validateRemoveUserRole,
    permissionMiddleware.hasPermission('user.edit'),
    userController.removeUserRole
);

module.exports = router;