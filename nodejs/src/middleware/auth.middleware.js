/**
 * Authentication middleware
 */
const jwt = require('jsonwebtoken');
const jwtConfig = require('@config/jwt');
const responseHandler = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

/**
 * Verify JWT token middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.verifyToken = (req, res, next) => {
  // Get authorization header
  const authHeader = req.headers.authorization;
  
  // Check if authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return responseHandler.error(
      res, 
      'No token provided', 
      responseCodes.UNAUTHORIZED
    );
  }

  // Extract token from authorization header
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    });

    // Set user in request object
    req.user = decoded;
    
    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return responseHandler.error(
        res, 
        'Token expired', 
        responseCodes.TOKEN_EXPIRED
      );
    }
    
    return responseHandler.error(
      res, 
      'Invalid token', 
      responseCodes.UNAUTHORIZED
    );
  }
};

/**
 * Check if user has required roles
 * @param {Array} roles - Array of required roles
 * @returns {Function} - Express middleware
 */
exports.hasRoles = (roles) => {
  return (req, res, next) => {
    // Check if user exists in request
    if (!req.user) {
      return responseHandler.error(
        res, 
        'Unauthorized', 
        responseCodes.UNAUTHORIZED
      );
    }

    // Check if user has any of the required roles
    const hasRequiredRole = req.user.roles.some(role => roles.includes(role));
    
    if (!hasRequiredRole) {
      return responseHandler.error(
        res, 
        'Access denied: insufficient role permissions', 
        responseCodes.INSUFFICIENT_ROLE
      );
    }

    // Continue to next middleware
    next();
  };
};

/**
 * Check if user has required permissions
 * @param {Array} permissions - Array of required permissions
 * @returns {Function} - Express middleware
 */
exports.hasPermissions = (permissions) => {
  return (req, res, next) => {
    // Check if user exists in request
    if (!req.user) {
      return responseHandler.error(
        res, 
        'Unauthorized', 
        responseCodes.UNAUTHORIZED
      );
    }

    // Check if user has all required permissions
    const hasAllPermissions = permissions.every(permission => 
      req.user.permissions.includes(permission)
    );
    
    if (!hasAllPermissions) {
      return responseHandler.error(
        res, 
        'Access denied: insufficient permissions', 
        responseCodes.INSUFFICIENT_PERMISSIONS
      );
    }

    // Continue to next middleware
    next();
  };
};