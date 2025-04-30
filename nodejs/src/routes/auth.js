/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const authController = require('@controllers/auth.controller');
const registerController = require('@controllers/register.controller');
const { loginValidation } = require('@middleware/validators/auth.validator');
const { registerValidation } = require('@middleware/validators/register.validator');
const { verifyToken, hasRoles } = require('@middleware/auth.middleware');

// Login route
router.post('/login', loginValidation, authController.login);

// Registration route
router.post('/register', registerValidation, registerController.register);

// Get current user profile
router.get('/profile', verifyToken, authController.getProfile);

// Refresh token route
router.post('/refresh-token', authController.refreshToken);

// Approve user (admin only)
router.patch('/approve/:userId', verifyToken, hasRoles(['admin']), registerController.approveUser);

module.exports = router;