/**
 * Authentication controller
 */
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('@src/models/user.model');
const jwtConfig = require('@config/jwt');
const responseHandler = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

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
      return responseHandler.error(
        res, 
        'Validation failed', 
        responseCodes.VALIDATION_ERROR, 
        { errors: errors.array() }
      );
    }

    const { username, password } = req.body;

    // Find user by username
    const user = await User.findByUsername(username);
    
    // If user not found
    if (!user) {
      return responseHandler.error(
        res, 
        'Invalid username or password', 
        responseCodes.INVALID_CREDENTIALS
      );
    }

    // Check if user is active and approved
    if (!user.is_active) {
      return responseHandler.error(
        res, 
        'Account is inactive', 
        responseCodes.INACTIVE_ACCOUNT
      );
    }
    
    if (!user.is_approved) {
      return responseHandler.error(
        res, 
        'Account is pending approval', 
        responseCodes.PENDING_APPROVAL
      );
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return responseHandler.error(
        res, 
        'Invalid username or password', 
        responseCodes.INVALID_CREDENTIALS
      );
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
    return responseHandler.success(
      res, 
      'Login successful', 
      responseCodes.SUCCESS, 
      {
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
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return responseHandler.error(
      res, 
      'Internal server error', 
      responseCodes.INTERNAL_ERROR
    );
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
      return responseHandler.error(
        res, 
        'User not found', 
        responseCodes.NOT_FOUND
      );
    }

    // Return user profile
    return responseHandler.success(
      res, 
      'User profile retrieved successfully', 
      responseCodes.SUCCESS, 
      {
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
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return responseHandler.error(
      res, 
      'Internal server error', 
      responseCodes.INTERNAL_ERROR
    );
  }
};

/**
 * Refresh token controller - Checks if old token is valid and returns a new token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with new token and user info
 */
exports.refreshToken = async (req, res) => {
  try {
    // Get token from request
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return responseHandler.error(
        res, 
        'No token provided', 
        responseCodes.UNAUTHORIZED
      );
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify the token without checking expiration
      const decoded = jwt.verify(token, jwtConfig.secret, {
        ignoreExpiration: true,
        issuer: jwtConfig.issuer,
        audience: jwtConfig.audience
      });
      
      // Get user from database
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return responseHandler.error(
          res, 
          'User not found', 
          responseCodes.NOT_FOUND
        );
      }
      
      // Check if user is active and approved
      if (!user.is_active) {
        return responseHandler.error(
          res, 
          'Account is inactive', 
          responseCodes.INACTIVE_ACCOUNT
        );
      }
      
      if (!user.is_approved) {
        return responseHandler.error(
          res, 
          'Account is pending approval', 
          responseCodes.PENDING_APPROVAL
        );
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
      
      // Generate new JWT token
      const newToken = jwt.sign(
        payload,
        jwtConfig.secret,
        {
          expiresIn: jwtConfig.expiresIn,
          issuer: jwtConfig.issuer,
          audience: jwtConfig.audience
        }
      );
      
      // Return success response with new token
      return responseHandler.success(
        res, 
        'Token refreshed successfully', 
        responseCodes.SUCCESS, 
        {
          token: newToken,
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
        }
      );
    } catch (error) {
      // If token is invalid or other error
      return responseHandler.error(
        res, 
        'Invalid token', 
        responseCodes.UNAUTHORIZED
      );
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    return responseHandler.error(
      res, 
      'Internal server error', 
      responseCodes.INTERNAL_ERROR
    );
  }
};