/**
 * Profile controller
 */
const { validationResult } = require('express-validator');
const User = require('@src/models/user.model');
const Auth = require('@src/models/auth.model');
const responseHandler = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.updateProfile = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler.error(
        res, 
        'Validation failed', 
        responseCodes.VALIDATION_ERROR, 
        { errors: errors.array() }
      );
    }

    const userId = req.user.id;
    const { username, email, fullName, phone } = req.body;
    
    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return responseHandler.error(
        res, 
        'User not found', 
        responseCodes.NOT_FOUND
      );
    }

    // Prepare update data
    const updateData = {};
    
    // Only include fields that are provided
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (fullName !== undefined) updateData.full_name = fullName;
    if (phone !== undefined) updateData.phone = phone;
    
    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return responseHandler.error(
          res, 
          'Email is already in use', 
          responseCodes.VALIDATION_ERROR
        );
      }
    }
    
    // Check if username is being changed and if it's already in use
    if (username && username !== user.username) {
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return responseHandler.error(
          res, 
          'Username is already in use', 
          responseCodes.VALIDATION_ERROR
        );
      }
    }
    
    // Update user profile
    await User.update(userId, updateData);
    
    // Get updated user data
    const updatedUser = await User.findById(userId);
    
    // Return success response
    return responseHandler.success(
      res, 
      'Profile updated successfully', 
      responseCodes.SUCCESS, 
      {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.full_name,
        phone: updatedUser.phone,
        roles: updatedUser.roles.map(role => ({
          id: role.id,
          name: role.name
        }))
      }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return responseHandler.error(
      res, 
      'Internal server error', 
      responseCodes.INTERNAL_ERROR
    );
  }
};

/**
 * Change user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.changePassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responseHandler.error(
        res, 
        'Validation failed', 
        responseCodes.VALIDATION_ERROR, 
        { errors: errors.array() }
      );
    }

    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Change password using Auth model
    const success = await Auth.changePassword(userId, currentPassword, newPassword);
    
    if (!success) {
      return responseHandler.error(
        res, 
        'Current password is incorrect', 
        responseCodes.VALIDATION_ERROR
      );
    }
    
    // Return success response
    return responseHandler.success(
      res, 
      'Password changed successfully', 
      responseCodes.SUCCESS
    );
  } catch (error) {
    console.error('Change password error:', error);
    return responseHandler.error(
      res, 
      'Internal server error', 
      responseCodes.INTERNAL_ERROR
    );
  }
};