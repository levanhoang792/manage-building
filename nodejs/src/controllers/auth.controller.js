/**
 * Authentication controller
 */
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('@src/models/user.model');
const jwtConfig = require('@config/jwt');

/**
 * Login controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.login = async (req, res) => {
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

    const { username, password } = req.body;

    // Find user by username
    const user = await User.findByUsername(username);
    
    // If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Check if user is active and approved
    if (!user.is_active || !user.is_approved) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or pending approval'
      });
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Get user roles and permissions
    const roles = await User.getUserRoles(user.id);
    const permissions = await User.getUserPermissions(user.id);

    // Create token payload
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: roles.map(role => role.name),
      permissions: permissions.map(permission => permission.name)
    };

    // Generate JWT token
    const token = jwt.sign(
      payload,
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience
      }
    );

    // Return success response with token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        roles: roles.map(role => ({
          id: role.id,
          name: role.name
        }))
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user by ID with roles
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user profile
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        roles: user.roles.map(role => ({
          id: role.id,
          name: role.name
        }))
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};