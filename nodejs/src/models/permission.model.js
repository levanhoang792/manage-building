/**
 * Permission model using Knex.js
 */
const db = require('@config/knex');

class Permission {
    /**
     * Find permission by ID
     * @param {number} id
     * @returns {Promise<Object|null>}
     */
    static async findById(id) {
        try {
            const permission = await db('permissions')
                .where({id})
                .first();

            return permission || null;
        } catch (error) {
            console.error('Error finding permission by ID:', error);
            throw error;
        }
    }

    /**
     * Find permission by name
     * @param {string} name
     * @returns {Promise<Object|null>}
     */
    static async findByName(name) {
        try {
            const permission = await db('permissions')
                .where({name})
                .first();

            return permission || null;
        } catch (error) {
            console.error('Error finding permission by name:', error);
            throw error;
        }
    }

    /**
     * Get all permissions with pagination and search
     * @param {number} page - Page number (starts from 1)
     * @param {number} limit - Number of items per page
     * @param {string} searchQuery - Optional search query
     * @returns {Promise<{permissions: Array, total: number, page: number, totalPages: number}>}
     */
    static async getAll(page = 1, limit = 10, searchQuery = '') {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Build query
            let query = db('permissions');

            // Apply search filter if provided
            if (searchQuery) {
                query = query.where(function() {
                    this.where('name', 'like', `%${searchQuery}%`)
                        .orWhere('description', 'like', `%${searchQuery}%`);
                });
            }

            // Get total count
            const countQuery = query.clone().clearSelect().count('id as count');
            const [{count}] = await countQuery;

            // Get paginated results
            const permissions = await query
                .select('*')
                .limit(limit)
                .offset(offset)
                .orderBy('id');

            // Calculate total pages
            const totalPages = Math.ceil(count / limit);

            return {
                permissions,
                total: count,
                page,
                totalPages
            };
        } catch (error) {
            console.error('Error getting all permissions:', error);
            throw error;
        }
    }
    
    /**
     * Get all permissions without pagination
     * @param {string} searchQuery - Optional search query
     * @returns {Promise<{permissions: Array, total: number}>}
     */
    static async getAllWithoutPagination(searchQuery = '') {
        try {
            // Build query
            let query = db('permissions');

            // Apply search filter if provided
            if (searchQuery) {
                query = query.where(function() {
                    this.where('name', 'like', `%${searchQuery}%`)
                        .orWhere('description', 'like', `%${searchQuery}%`);
                });
            }

            // Get total count
            const countQuery = query.clone().clearSelect().count('id as count');
            const [{count}] = await countQuery;

            // Get all results without pagination
            const permissions = await query
                .select('*')
                .orderBy('id');

            return {
                permissions,
                total: count
            };
        } catch (error) {
            console.error('Error getting all permissions without pagination:', error);
            throw error;
        }
    }

    /**
     * Create a new permission
     * @param {Object} permissionData - Permission data
     * @returns {Promise<number>} - New permission ID
     */
    static async create(permissionData) {
        try {
            const [id] = await db('permissions').insert(permissionData);
            return id;
        } catch (error) {
            console.error('Error creating permission:', error);
            throw error;
        }
    }

    /**
     * Update permission
     * @param {number} permissionId - Permission ID
     * @param {Object} permissionData - Permission data to update
     * @returns {Promise<number>} - Number of affected rows
     */
    static async update(permissionId, permissionData) {
        try {
            return await db('permissions')
                .where('id', permissionId)
                .update(permissionData);
        } catch (error) {
            console.error('Error updating permission:', error);
            throw error;
        }
    }

    /**
     * Delete permission
     * @param {number} permissionId - Permission ID
     * @returns {Promise<number>} - Number of affected rows
     */
    static async delete(permissionId) {
        try {
            return await db('permissions')
                .where('id', permissionId)
                .delete();
        } catch (error) {
            console.error('Error deleting permission:', error);
            throw error;
        }
    }

    /**
     * Get roles with permission
     * @param {number} permissionId - Permission ID
     * @returns {Promise<Array>}
     */
    static async getRolesWithPermission(permissionId) {
        try {
            return await db('roles as r')
                .join('role_permissions as rp', 'r.id', 'rp.role_id')
                .where('rp.permission_id', permissionId)
                .select('r.id', 'r.name', 'r.description');
        } catch (error) {
            console.error('Error getting roles with permission:', error);
            throw error;
        }
    }
}

module.exports = Permission;