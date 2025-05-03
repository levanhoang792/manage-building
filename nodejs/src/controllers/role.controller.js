/**
 * Role management controller
 */
const { validationResult } = require('express-validator');
const Role = require('@src/models/role.model');
const Permission = require('@src/models/permission.model');
const responseHandler = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

/**
 * Get all roles with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getAllRoles = async (req, res) => {
    try {
        // Get query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.q || '';

        // Get roles with pagination
        const result = await Role.getAll(page, limit, searchQuery);

        // Return success response
        return responseHandler.success(
            res,
            'Roles retrieved successfully',
            responseCodes.SUCCESS,
            {
                roles: result.roles,
                total: result.total,
                page: result.page,
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
 * Get role by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getRoleById = async (req, res) => {
    try {
        const roleId = req.params.id;

        // Find role by ID
        const role = await Role.findById(roleId);

        if (!role) {
            return responseHandler.error(
                res,
                'Role not found',
                responseCodes.NOT_FOUND
            );
        }

        // Get role permissions
        const permissions = await Role.getRolePermissions(roleId);

        // Return role data with permissions
        return responseHandler.success(
            res,
            'Role retrieved successfully',
            responseCodes.SUCCESS,
            {
                ...role,
                permissions
            }
        );
    } catch (error) {
        console.error('Error getting role by ID:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Create a new role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.createRole = async (req, res) => {
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

        const { name, description } = req.body;

        // Check if role name already exists
        const existingRole = await Role.findByName(name);
        if (existingRole) {
            return responseHandler.error(
                res,
                'Role name already exists',
                responseCodes.VALIDATION_ERROR
            );
        }

        // Create role
        const roleId = await Role.create({
            name,
            description: description || null,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Get created role
        const role = await Role.findById(roleId);

        // Return success response
        return responseHandler.success(
            res,
            'Role created successfully',
            responseCodes.CREATED,
            role
        );
    } catch (error) {
        console.error('Error creating role:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Update role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.updateRole = async (req, res) => {
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

        const roleId = req.params.id;
        const { name, description } = req.body;

        // Check if role exists
        const role = await Role.findById(roleId);
        if (!role) {
            return responseHandler.error(
                res,
                'Role not found',
                responseCodes.NOT_FOUND
            );
        }

        // Check if role name already exists (if changed)
        if (name !== role.name) {
            const existingRole = await Role.findByName(name);
            if (existingRole) {
                return responseHandler.error(
                    res,
                    'Role name already exists',
                    responseCodes.VALIDATION_ERROR
                );
            }
        }

        // Update role
        await Role.update(roleId, {
            name,
            description: description || null,
            updated_at: new Date()
        });

        // Get updated role
        const updatedRole = await Role.findById(roleId);

        // Return success response
        return responseHandler.success(
            res,
            'Role updated successfully',
            responseCodes.SUCCESS,
            updatedRole
        );
    } catch (error) {
        console.error('Error updating role:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Delete role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.deleteRole = async (req, res) => {
    try {
        const roleId = req.params.id;

        // Check if role exists
        const role = await Role.findById(roleId);
        if (!role) {
            return responseHandler.error(
                res,
                'Role not found',
                responseCodes.NOT_FOUND
            );
        }

        // Check if role is in use
        const usersWithRole = await Role.getUsersWithRole(roleId);
        if (usersWithRole.length > 0) {
            return responseHandler.error(
                res,
                'Cannot delete role: it is assigned to users',
                responseCodes.CONFLICT
            );
        }

        // Delete role
        await Role.delete(roleId);

        // Return success response
        return responseHandler.success(
            res,
            'Role deleted successfully',
            responseCodes.SUCCESS
        );
    } catch (error) {
        console.error('Error deleting role:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Get role permissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getRolePermissions = async (req, res) => {
    try {
        const roleId = req.params.id;

        // Check if role exists
        const role = await Role.findById(roleId);
        if (!role) {
            return responseHandler.error(
                res,
                'Role not found',
                responseCodes.NOT_FOUND
            );
        }

        // Get role permissions
        const permissions = await Role.getRolePermissions(roleId);

        // Return success response
        return responseHandler.success(
            res,
            'Role permissions retrieved successfully',
            responseCodes.SUCCESS,
            permissions
        );
    } catch (error) {
        console.error('Error getting role permissions:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Assign permissions to role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.assignRolePermissions = async (req, res) => {
    try {
        const roleId = req.params.id;
        const { permissionIds } = req.body;

        // Check if permissionIds is provided and is an array
        if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
            return responseHandler.error(
                res,
                'Permission IDs must be provided as an array',
                responseCodes.VALIDATION_ERROR
            );
        }

        // Check if role exists
        const role = await Role.findById(roleId);
        if (!role) {
            return responseHandler.error(
                res,
                'Role not found',
                responseCodes.NOT_FOUND
            );
        }

        // Get current permissions
        const currentPermissions = await Role.getRolePermissions(roleId);
        const currentPermissionIds = currentPermissions.map(permission => permission.id);
        
        // Permissions to add
        const permissionsToAdd = permissionIds.filter(permissionId => !currentPermissionIds.includes(permissionId));
        
        // Permissions to remove
        const permissionsToRemove = currentPermissionIds.filter(permissionId => !permissionIds.includes(permissionId));
        
        // Add new permissions
        for (const permissionId of permissionsToAdd) {
            await Role.assignPermission(roleId, permissionId);
        }
        
        // Remove permissions
        for (const permissionId of permissionsToRemove) {
            await Role.removePermission(roleId, permissionId);
        }

        // Get updated permissions
        const updatedPermissions = await Role.getRolePermissions(roleId);

        // Return success response
        return responseHandler.success(
            res,
            'Role permissions updated successfully',
            responseCodes.SUCCESS,
            updatedPermissions
        );
    } catch (error) {
        console.error('Error assigning role permissions:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Remove permission from role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.removeRolePermission = async (req, res) => {
    try {
        const roleId = req.params.id;
        const permissionId = req.params.permissionId;

        // Check if role exists
        const role = await Role.findById(roleId);
        if (!role) {
            return responseHandler.error(
                res,
                'Role not found',
                responseCodes.NOT_FOUND
            );
        }

        // Check if permission exists
        const permission = await Permission.findById(permissionId);
        if (!permission) {
            return responseHandler.error(
                res,
                'Permission not found',
                responseCodes.NOT_FOUND
            );
        }

        // Remove permission
        await Role.removePermission(roleId, permissionId);

        // Get updated permissions
        const updatedPermissions = await Role.getRolePermissions(roleId);

        // Return success response
        return responseHandler.success(
            res,
            'Permission removed from role successfully',
            responseCodes.SUCCESS,
            updatedPermissions
        );
    } catch (error) {
        console.error('Error removing role permission:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};