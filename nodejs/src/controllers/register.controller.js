/**
 * Registration controller
 */
const { validationResult } = require('express-validator');
const Auth = require('@src/models/auth.model');
const User = require('@src/models/user.model');
const Role = require('@src/models/role.model');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { username, email, password, fullName } = req.body;

    // Check if username already exists
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Check if email already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Get default user role (assuming 'user' role exists)
    const userRole = await Role.findByName('user');
    if (!userRole) {
      return res.status(500).json({
        success: false,
        message: 'Default user role not found'
      });
    }

    // Prepare user data
    const userData = {
      username,
      email,
      password,
      full_name: fullName,
      is_active: true,
      is_approved: false // Requires admin approval
    };

    // Register user with default role
    const user = await Auth.register(userData, [userRole.id]);

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending approval.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        roles: user.roles.map(role => ({
          id: role.id,
          name: role.name
        }))
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Approve user registration (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user approval status
    await User.update(userId, { is_approved: true });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'User approved successfully'
    });
  } catch (error) {
    console.error('User approval error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};