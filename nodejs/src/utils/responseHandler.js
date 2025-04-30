/**
 * Response handler utility
 * Standardizes API responses across the application
 */
const responseCodes = require('@utils/responseCodes');

/**
 * Map application response code to HTTP status code
 * @param {number} code - Application response code
 * @returns {number} - HTTP status code
 */
const getHttpStatusCode = (code) => {
  // Custom codes (1000+) map to their corresponding HTTP status
  if (code >= 1000) {
    // Map custom codes to appropriate HTTP status codes
    switch (code) {
      case responseCodes.TOKEN_EXPIRED:
      case responseCodes.INACTIVE_ACCOUNT:
      case responseCodes.PENDING_APPROVAL:
      case responseCodes.INVALID_CREDENTIALS:
        return 401; // Unauthorized
      case responseCodes.INSUFFICIENT_PERMISSIONS:
      case responseCodes.INSUFFICIENT_ROLE:
        return 403; // Forbidden
      default:
        return 400; // Default to Bad Request for unknown custom codes
    }
  }
  
  // Standard codes (below 1000) map directly to HTTP status codes
  return code;
};

/**
 * Create a standardized success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {number} code - Response code (default: 200)
 * @param {any} data - Response data (optional)
 * @returns {Object} - JSON response
 */
exports.success = (res, message, code = responseCodes.SUCCESS, data = null) => {
  const response = {
    message,
    r: code,
  };

  if (data !== null) {
    response.data = data;
  }

  // Determine HTTP status code
  const httpStatusCode = getHttpStatusCode(code);
  
  return res.status(httpStatusCode).json(response);
};

/**
 * Create a standardized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} code - Response code (default: 400)
 * @param {any} data - Additional error data (optional)
 * @returns {Object} - JSON response
 */
exports.error = (res, message, code = responseCodes.BAD_REQUEST, data = null) => {
  const response = {
    message,
    r: code,
  };

  if (data !== null) {
    response.data = data;
  }

  // Determine HTTP status code
  const httpStatusCode = getHttpStatusCode(code);
  
  return res.status(httpStatusCode).json(response);
};