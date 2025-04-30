/**
 * Profile routes
 */
const express = require('express');
const router = express.Router();
const profileController = require('@controllers/profile.controller');
const { updateProfileValidation } = require('@middleware/validators/profile.validator');
const { changePasswordValidation } = require('@middleware/validators/password.validator');
const { verifyToken } = require('@middleware/auth.middleware');

// Update user profile
router.put('/', verifyToken, updateProfileValidation, profileController.updateProfile);

// Change password
router.post('/change-password', verifyToken, changePasswordValidation, profileController.changePassword);

module.exports = router;