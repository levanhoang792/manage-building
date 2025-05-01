/**
 * Registration controller
 */
const {validationResult} = require('express-validator');
const Auth = require('@src/models/auth.model');
const User = require('@src/models/user.model');
const Role = require('@src/models/role.model');
const responseHandler = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

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
            return responseHandler.error(
                res,
                'Validation failed',
                responseCodes.VALIDATION_ERROR,
                {errors: errors.array()}
            );
        }

        const {username, email, password, fullName} = req.body;

        // Check if username already exists
        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return responseHandler.error(
                res,
                'Username already exists',
                responseCodes.CONFLICT
            );
        }

        // Check if email already exists
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return responseHandler.error(
                res,
                'Email already exists',
                responseCodes.CONFLICT
            );
        }

        // Get default user role (assuming 'user' role exists)
        const userRole = await Role.findByName('user');
        if (!userRole) {
            return responseHandler.error(
                res,
                'Default user role not found',
                responseCodes.INTERNAL_ERROR
            );
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
        return responseHandler.success(
            res,
            'Registration successful. Your account is pending approval.',
            responseCodes.CREATED,
            {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                roles: user.roles.map(role => ({
                    id: role.id,
                    name: role.name
                }))
            }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
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
        const {userId} = req.params;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return responseHandler.error(
                res,
                'User not found',
                responseCodes.NOT_FOUND
            );
        }

        // Update user approval status
        await User.update(userId, {is_approved: true});

        // Return success response
        return responseHandler.success(
            res,
            'User approved successfully',
            responseCodes.SUCCESS
        );
    } catch (error) {
        console.error('User approval error:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};