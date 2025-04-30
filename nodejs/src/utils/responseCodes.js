/**
 * Response codes for API
 * 
 * Codes are generally aligned with HTTP status codes for easier understanding,
 * but they are separate integer values.
 * 
 * Ranges:
 * - 200-299: Success
 * - 400-499: Client errors
 * - 500-599: Server errors
 * - 1000+: Custom application-specific codes
 */

module.exports = {
  // Success codes (200-299)
  SUCCESS: 200,                    // General success
  CREATED: 201,                    // Resource created
  ACCEPTED: 202,                   // Request accepted but not completed
  NO_CONTENT: 204,                 // Success but no content to return
  
  // Client error codes (400-499)
  BAD_REQUEST: 400,                // Invalid request format or parameters
  UNAUTHORIZED: 401,               // Authentication required or failed
  FORBIDDEN: 403,                  // Permission denied
  NOT_FOUND: 404,                  // Resource not found
  METHOD_NOT_ALLOWED: 405,         // HTTP method not allowed
  CONFLICT: 409,                   // Resource conflict (e.g., duplicate entry)
  VALIDATION_ERROR: 422,           // Validation failed
  TOO_MANY_REQUESTS: 429,          // Rate limit exceeded
  
  // Server error codes (500-599)
  INTERNAL_ERROR: 500,             // General server error
  NOT_IMPLEMENTED: 501,            // Feature not implemented
  SERVICE_UNAVAILABLE: 503,        // Service temporarily unavailable
  
  // Custom codes (1000+)
  TOKEN_EXPIRED: 1001,             // JWT token expired
  INACTIVE_ACCOUNT: 1002,          // Account is inactive
  PENDING_APPROVAL: 1003,          // Account pending approval
  INVALID_CREDENTIALS: 1004,       // Invalid username or password
  INSUFFICIENT_PERMISSIONS: 1005,  // User lacks specific permissions
  INSUFFICIENT_ROLE: 1006,         // User lacks required role
};