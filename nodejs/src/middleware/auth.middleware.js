/**
 * Authentication middleware
 */
const jwt = require('jsonwebtoken');
const jwtConfig = require('@config/jwt');

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
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
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
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
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
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Check if user has any of the required roles
    const hasRequiredRole = req.user.roles.some(role => roles.includes(role));
    
    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient role permissions'
      });
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
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Check if user has all required permissions
    const hasAllPermissions = permissions.every(permission => 
      req.user.permissions.includes(permission)
    );
    
    if (!hasAllPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions'
      });
    }

    // Continue to next middleware
    next();
  };
};