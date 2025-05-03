/**
 * User management controller
 */
const { validationResult } = require('express-validator');
const User = require('@models/user.model');
const Role = require('@models/role.model');
const bcrypt = require('bcrypt');
const responseHandler = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

/**
 * Get all users with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getAllUsers = async (req, res) => {
    try {
        // Get query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.q || '';
        const status = req.query.status;

        // Build filters
        const filters = {};
        
        if (searchQuery) {
            // Search in username, email, or full_name
            filters.searchQuery = searchQuery;
        }

        if (status === 'active') {
            filters.isActive = true;
        } else if (status === 'inactive') {
            filters.isActive = false;
        }

        // Get users with pagination
        const result = await User.getAll(page, limit, filters);

        // Get roles for each user
        const usersWithRoles = await Promise.all(
            result.users.map(async (user) => {
                const roles = await User.getUserRoles(user.id);
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.full_name,
                    phone: user.phone,
                    isActive: user.is_active,
                    isApproved: user.is_approved,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    roles: roles.map(role => ({
                        id: role.id,
                        name: role.name,
                        description: role.description
                    }))
                };
            })
        );

        // Return success response
        return responseHandler.success(
            res,
            'Users retrieved successfully',
            responseCodes.SUCCESS,
            {
                users: usersWithRoles,
                total: result.total,
                page: result.page,
                limit
            }
        );
    } catch (error) {
        console.error('Error getting users:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Get pending users with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getPendingUsers = async (req, res) => {
    try {
        // Get query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.q || '';

        // Build filters
        const filters = {
            isApproved: false
        };
        
        if (searchQuery) {
            // Search in username, email, or full_name
            filters.searchQuery = searchQuery;
        }

        // Get users with pagination
        const result = await User.getAll(page, limit, filters);

        // Get roles for each user
        const usersWithRoles = await Promise.all(
            result.users.map(async (user) => {
                const roles = await User.getUserRoles(user.id);
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.full_name,
                    phone: user.phone,
                    isActive: user.is_active,
                    isApproved: user.is_approved,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    roles: roles.map(role => ({
                        id: role.id,
                        name: role.name,
                        description: role.description
                    }))
                };
            })
        );

        // Return success response
        return responseHandler.success(
            res,
            'Pending users retrieved successfully',
            responseCodes.SUCCESS,
            {
                users: usersWithRoles,
                total: result.total,
                page: result.page,
                limit
            }
        );
    } catch (error) {
        console.error('Error getting pending users:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find user by ID
        const user = await User.findById(userId);

        if (!user) {
            return responseHandler.error(
                res,
                'User not found',
                responseCodes.NOT_FOUND
            );
        }

        // Return user data
        return responseHandler.success(
            res,
            'User retrieved successfully',
            responseCodes.SUCCESS,
            {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                phone: user.phone,
                isActive: user.is_active,
                isApproved: user.is_approved,
                created_at: user.created_at,
                updated_at: user.updated_at,
                roles: user.roles.map(role => ({
                    id: role.id,
                    name: role.name,
                    description: role.description
                }))
            }
        );
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.createUser = async (req, res) => {
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

        const { username, email, password, fullName, phone, roles } = req.body;

        // Check if username already exists
        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return responseHandler.error(
                res,
                'Username already exists',
                responseCodes.VALIDATION_ERROR
            );
        }

        // Check if email already exists
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return responseHandler.error(
                res,
                'Email already exists',
                responseCodes.VALIDATION_ERROR
            );
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const userId = await User.create({
            username,
            email,
            password: hashedPassword,
            full_name: fullName,
            phone: phone || null,
            is_active: true,
            is_approved: true,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Assign roles to user
        if (roles && roles.length > 0) {
            for (const roleId of roles) {
                await User.assignRole(userId, roleId);
            }
        }

        // Get created user with roles
        const user = await User.findById(userId);

        // Return success response
        return responseHandler.success(
            res,
            'User created successfully',
            responseCodes.CREATED,
            {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name,
                phone: user.phone,
                isActive: user.is_active,
                isApproved: user.is_approved,
                created_at: user.created_at,
                updated_at: user.updated_at,
                roles: user.roles.map(role => ({
                    id: role.id,
                    name: role.name,
                    description: role.description
                }))
            }
        );
    } catch (error) {
        console.error('Error creating user:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Update user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.updateUser = async (req, res) => {
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

        const userId = req.params.id;
        const { username, email, fullName, phone, isActive, roles } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return responseHandler.error(
                res,
                'User not found',
                responseCodes.NOT_FOUND
            );
        }

        // Check if username already exists (if changed)
        if (username !== user.username) {
            const existingUsername = await User.findByUsername(username);
            if (existingUsername) {
                return responseHandler.error(
                    res,
                    'Username already exists',
                    responseCodes.VALIDATION_ERROR
                );
            }
        }

        // Check if email already exists (if changed)
        if (email !== user.email) {
            const existingEmail = await User.findByEmail(email);
            if (existingEmail) {
                return responseHandler.error(
                    res,
                    'Email already exists',
                    responseCodes.VALIDATION_ERROR
                );
            }
        }

        // Update user
        await User.update(userId, {
            username,
            email,
            full_name: fullName,
            phone: phone || null,
            is_active: isActive !== undefined ? isActive : user.is_active,
            updated_at: new Date()
        });

        // Update roles if provided
        if (roles && Array.isArray(roles)) {
            // Get current roles
            const currentRoles = await User.getUserRoles(userId);
            const currentRoleIds = currentRoles.map(role => role.id);
            
            // Roles to add
            const rolesToAdd = roles.filter(roleId => !currentRoleIds.includes(roleId));
            
            // Roles to remove
            const rolesToRemove = currentRoleIds.filter(roleId => !roles.includes(roleId));
            
            // Add new roles
            for (const roleId of rolesToAdd) {
                await User.assignRole(userId, roleId);
            }
            
            // Remove roles
            for (const roleId of rolesToRemove) {
                await User.removeRole(userId, roleId);
            }
        }

        // Get updated user with roles
        const updatedUser = await User.findById(userId);

        // Return success response
        return responseHandler.success(
            res,
            'User updated successfully',
            responseCodes.SUCCESS,
            {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                fullName: updatedUser.full_name,
                phone: updatedUser.phone,
                isActive: updatedUser.is_active,
                isApproved: updatedUser.is_approved,
                created_at: updatedUser.created_at,
                updated_at: updatedUser.updated_at,
                roles: updatedUser.roles.map(role => ({
                    id: role.id,
                    name: role.name,
                    description: role.description
                }))
            }
        );
    } catch (error) {
        console.error('Error updating user:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return responseHandler.error(
                res,
                'User not found',
                responseCodes.NOT_FOUND
            );
        }

        // Delete user
        await User.delete(userId);

        // Return success response
        return responseHandler.success(
            res,
            'User deleted successfully',
            responseCodes.SUCCESS
        );
    } catch (error) {
        console.error('Error deleting user:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Approve user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.approveUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { comment } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return responseHandler.error(
                res,
                'User not found',
                responseCodes.NOT_FOUND
            );
        }

        // Check if user is already approved
        if (user.is_approved) {
            return responseHandler.error(
                res,
                'User is already approved',
                responseCodes.BAD_REQUEST
            );
        }

        // Approve user
        await User.update(userId, {
            is_approved: true,
            updated_at: new Date()
        });

        // TODO: Send approval notification to user with comment

        // Return success response
        return responseHandler.success(
            res,
            'User approved successfully',
            responseCodes.SUCCESS
        );
    } catch (error) {
        console.error('Error approving user:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Reject user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.rejectUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { comment } = req.body;

        // Check if comment is provided
        if (!comment) {
            return responseHandler.error(
                res,
                'Rejection reason is required',
                responseCodes.VALIDATION_ERROR
            );
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return responseHandler.error(
                res,
                'User not found',
                responseCodes.NOT_FOUND
            );
        }

        // Check if user is already approved
        if (user.is_approved) {
            return responseHandler.error(
                res,
                'Cannot reject an already approved user',
                responseCodes.BAD_REQUEST
            );
        }

        // Reject user (delete or mark as rejected)
        await User.delete(userId);

        // TODO: Send rejection notification to user with comment

        // Return success response
        return responseHandler.success(
            res,
            'User rejected successfully',
            responseCodes.SUCCESS
        );
    } catch (error) {
        console.error('Error rejecting user:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Get all roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getAllRoles = async (req, res) => {
    try {
        // Get query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100; // Default to a high limit for roles
        const searchQuery = req.query.q || '';

        // Get roles
        const roles = await Role.getAll(page, limit, searchQuery);

        // Return success response
        return responseHandler.success(
            res,
            'Roles retrieved successfully',
            responseCodes.SUCCESS,
            {
                roles: roles.roles,
                total: roles.total,
                page: roles.page,
                limit
            }
        );
    } catch (error) {
        console.error('Error getting roles:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Get user roles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getUserRoles = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return responseHandler.error(
                res,
                'User not found',
                responseCodes.NOT_FOUND
            );
        }

        // Get user roles
        const roles = await User.getUserRoles(userId);

        // Return success response
        return responseHandler.success(
            res,
            'User roles retrieved successfully',
            responseCodes.SUCCESS,
            roles
        );
    } catch (error) {
        console.error('Error getting user roles:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Assign roles to user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.assignUserRoles = async (req, res) => {
    try {
        const userId = req.params.id;
        const { roleIds } = req.body;

        // Check if roleIds is provided and is an array
        if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
            return responseHandler.error(
                res,
                'Role IDs must be provided as an array',
                responseCodes.VALIDATION_ERROR
            );
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return responseHandler.error(
                res,
                'User not found',
                responseCodes.NOT_FOUND
            );
        }

        // Get current roles
        const currentRoles = await User.getUserRoles(userId);
        const currentRoleIds = currentRoles.map(role => role.id);
        
        // Roles to add
        const rolesToAdd = roleIds.filter(roleId => !currentRoleIds.includes(roleId));
        
        // Roles to remove
        const rolesToRemove = currentRoleIds.filter(roleId => !roleIds.includes(roleId));
        
        // Add new roles
        for (const roleId of rolesToAdd) {
            await User.assignRole(userId, roleId);
        }
        
        // Remove roles
        for (const roleId of rolesToRemove) {
            await User.removeRole(userId, roleId);
        }

        // Get updated roles
        const updatedRoles = await User.getUserRoles(userId);

        // Return success response
        return responseHandler.success(
            res,
            'User roles updated successfully',
            responseCodes.SUCCESS,
            updatedRoles
        );
    } catch (error) {
        console.error('Error assigning user roles:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Remove role from user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.removeUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const roleId = req.params.roleId;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return responseHandler.error(
                res,
                'User not found',
                responseCodes.NOT_FOUND
            );
        }

        // Remove role
        await User.removeRole(userId, roleId);

        // Get updated roles
        const updatedRoles = await User.getUserRoles(userId);

        // Return success response
        return responseHandler.success(
            res,
            'Role removed from user successfully',
            responseCodes.SUCCESS,
            updatedRoles
        );
    } catch (error) {
        console.error('Error removing user role:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};