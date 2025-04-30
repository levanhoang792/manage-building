/**
 * Profile routes
 */
const express = require('express');
const router = express.Router();
const profileController = require('@controllers/profile.controller');
const { updateProfileValidation } = require('@middleware/validators/profile.validator');
const { verifyToken } = require('@middleware/auth.middleware');

// Update user profile
router.put('/', verifyToken, updateProfileValidation, profileController.updateProfile);

module.exports = router;