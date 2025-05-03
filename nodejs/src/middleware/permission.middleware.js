/**
 * Permission middleware
 */
const responseHandler = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

/**
 * Check if user has required role
 * @param {string|string[]} roles - Required role(s)
 * @returns {function} - Middleware function
 */
exports.hasRole = (roles) => {
    return (req, res, next) => {
        try {
            // Get user from request (set by auth middleware)
            const user = req.user;

            if (!user) {
                return responseHandler.error(
                    res,
                    'Unauthorized',
                    responseCodes.UNAUTHORIZED
                );
            }

            // Convert roles to array if it's a string
            const requiredRoles = Array.isArray(roles) ? roles : [roles];

            // Check if user has roles property
            if (!user.roles || !Array.isArray(user.roles)) {
                return responseHandler.error(
                    res,
                    'Forbidden: User roles not found',
                    responseCodes.FORBIDDEN
                );
            }

            // Check if user has any of the required roles
            const hasRequiredRole = user.roles.some(role =>
                requiredRoles.includes(role)
            );

            if (!hasRequiredRole) {
                return responseHandler.error(
                    res,
                    'Forbidden: Insufficient role privileges',
                    responseCodes.FORBIDDEN
                );
            }

            // User has required role, proceed
            next();
        } catch (error) {
            console.error('Error in role check middleware:', error);
            return responseHandler.error(
                res,
                'Internal server error',
                responseCodes.INTERNAL_ERROR
            );
        }
    };
};

/**
 * Check if user has required permission
 * @param {string|string[]} permissions - Required permission(s)
 * @returns {function} - Middleware function
 */
exports.hasPermission = (permissions) => {
    return (req, res, next) => {
        try {
            // Get user from request (set by auth middleware)
            const user = req.user;
            console.log("------> Line: 74 | permission.middleware.js user: ", user);

            if (!user) {
                return responseHandler.error(
                    res,
                    'Unauthorized',
                    responseCodes.UNAUTHORIZED
                );
            }

            // Convert permissions to array if it's a string
            const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

            // Check if user has permissions property
            if (!user.permissions || !Array.isArray(user.permissions)) {
                return responseHandler.error(
                    res,
                    'Forbidden: User permissions not found',
                    responseCodes.FORBIDDEN
                );
            }

            // Check if user has any of the required permissions
            const hasRequiredPermission = user.permissions.some(permission =>
                requiredPermissions.includes(permission)
            );

            if (!hasRequiredPermission) {
                return responseHandler.error(
                    res,
                    'Forbidden: Insufficient permissions',
                    responseCodes.FORBIDDEN
                );
            }

            // User has required permission, proceed
            next();
        } catch (error) {
            console.error('Error in permission check middleware:', error);
            return responseHandler.error(
                res,
                'Internal server error',
                responseCodes.INTERNAL_ERROR
            );
        }
    };
};

/**
 * Check if user is an admin (has admin or super_admin role)
 * @returns {function} - Middleware function
 */
exports.isAdmin = (req, res, next) => {
    try {
        // Get user from request (set by auth middleware)
        const user = req.user;

        if (!user) {
            return responseHandler.error(
                res,
                'Unauthorized',
                responseCodes.UNAUTHORIZED
            );
        }

        // Check if user has roles property
        if (!user.roles || !Array.isArray(user.roles)) {
            return responseHandler.error(
                res,
                'Forbidden: User roles not found',
                responseCodes.FORBIDDEN
            );
        }

        // Check if user has admin or super_admin role
        const isAdmin = user.roles.some(role =>
            ['admin', 'super_admin'].includes(role)
        );

        if (!isAdmin) {
            return responseHandler.error(
                res,
                'Forbidden: Admin privileges required',
                responseCodes.FORBIDDEN
            );
        }

        // User is admin, proceed
        next();
    } catch (error) {
        console.error('Error in admin check middleware:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};