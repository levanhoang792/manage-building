/**
 * Permission management controller
 */
const { validationResult } = require('express-validator');
const Permission = require('@src/models/permission.model');
const responseHandler = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

/**
 * Get all permissions with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getAllPermissions = async (req, res) => {
    try {
        // Get query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.q || '';
        const all = req.query.all === 'true'; // Check if all=true parameter is provided

        let result;
        
        if (all) {
            // Get all permissions without pagination
            result = await Permission.getAllWithoutPagination(searchQuery);
            
            // Return success response with all permissions
            return responseHandler.success(
                res,
                'All permissions retrieved successfully',
                responseCodes.SUCCESS,
                {
                    permissions: result.permissions,
                    total: result.total,
                    page: 1,
                    limit: result.total // Set limit to total count to indicate no pagination
                }
            );
        } else {
            // Get permissions with pagination
            result = await Permission.getAll(page, limit, searchQuery);
            
            // Return success response with paginated permissions
            return responseHandler.success(
                res,
                'Permissions retrieved successfully',
                responseCodes.SUCCESS,
                {
                    permissions: result.permissions,
                    total: result.total,
                    page: result.page,
                    limit
                }
            );
        }
    } catch (error) {
        console.error('Error getting permissions:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Get permission by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getPermissionById = async (req, res) => {
    try {
        const permissionId = req.params.id;

        // Find permission by ID
        const permission = await Permission.findById(permissionId);

        if (!permission) {
            return responseHandler.error(
                res,
                'Permission not found',
                responseCodes.NOT_FOUND
            );
        }

        // Return permission data
        return responseHandler.success(
            res,
            'Permission retrieved successfully',
            responseCodes.SUCCESS,
            permission
        );
    } catch (error) {
        console.error('Error getting permission by ID:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};

/**
 * Get roles with permission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response
 */
exports.getRolesWithPermission = async (req, res) => {
    try {
        const permissionId = req.params.id;

        // Check if permission exists
        const permission = await Permission.findById(permissionId);
        if (!permission) {
            return responseHandler.error(
                res,
                'Permission not found',
                responseCodes.NOT_FOUND
            );
        }

        // Get roles with permission
        const roles = await Permission.getRolesWithPermission(permissionId);

        // Return success response
        return responseHandler.success(
            res,
            'Roles with permission retrieved successfully',
            responseCodes.SUCCESS,
            roles
        );
    } catch (error) {
        console.error('Error getting roles with permission:', error);
        return responseHandler.error(
            res,
            'Internal server error',
            responseCodes.INTERNAL_ERROR
        );
    }
};