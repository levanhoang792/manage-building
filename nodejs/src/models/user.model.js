/**
 * User model using Knex.js
 */
const db = require('@config/knex');
const bcrypt = require('bcrypt');

class User {
    /**
     * Find user by username
     * @param {string} username
     * @returns {Promise<Object|null>}
     */
    static async findByUsername(username) {
        try {
            const user = await db('users')
                .where({username})
                .first();

            return user || null;
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    /**
     * Find user by email
     * @param {string} email
     * @returns {Promise<Object|null>}
     */
    static async findByEmail(email) {
        try {
            const user = await db('users')
                .where({email})
                .first();

            return user || null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    /**
     * Get user roles
     * @param {number} userId
     * @returns {Promise<Array>}
     */
    static async getUserRoles(userId) {
        try {
            return await db('roles as r')
                .join('user_roles as ur', 'r.id', 'ur.role_id')
                .where('ur.user_id', userId)
                .select('r.id', 'r.name', 'r.description');
        } catch (error) {
            console.error('Error getting user roles:', error);
            throw error;
        }
    }

    /**
     * Get user permissions
     * @param {number} userId
     * @returns {Promise<Array>}
     */
    static async getUserPermissions(userId) {
        try {
            return await db('permissions as p')
                .join('role_permissions as rp', 'p.id', 'rp.permission_id')
                .join('user_roles as ur', 'rp.role_id', 'ur.role_id')
                .where('ur.user_id', userId)
                .distinct('p.id', 'p.name', 'p.description');
        } catch (error) {
            console.error('Error getting user permissions:', error);
            throw error;
        }
    }

    /**
     * Verify password
     * @param {string} password - Plain text password
     * @param {string} hashedPassword - Hashed password from database
     * @returns {Promise<boolean>}
     */
    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<number>} - New user ID
     */
    static async create(userData) {
        try {
            const [id] = await db('users').insert(userData);
            return id;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Update user
     * @param {number} userId - User ID
     * @param {Object} userData - User data to update
     * @returns {Promise<number>} - Number of affected rows
     */
    static async update(userId, userData) {
        try {
            return await db('users')
                .where('id', userId)
                .update(userData);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    /**
     * Delete user
     * @param {number} userId - User ID
     * @returns {Promise<number>} - Number of affected rows
     */
    static async delete(userId) {
        try {
            return await db('users')
                .where('id', userId)
                .delete();
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    /**
     * Assign role to user
     * @param {number} userId - User ID
     * @param {number} roleId - Role ID
     * @returns {Promise<void>}
     */
    static async assignRole(userId, roleId) {
        try {
            // Check if the role assignment already exists
            const exists = await db('user_roles')
                .where({
                    user_id: userId,
                    role_id: roleId
                })
                .first();

            if (!exists) {
                await db('user_roles').insert({
                    user_id: userId,
                    role_id: roleId
                });
            }
        } catch (error) {
            console.error('Error assigning role to user:', error);
            throw error;
        }
    }

    /**
     * Remove role from user
     * @param {number} userId - User ID
     * @param {number} roleId - Role ID
     * @returns {Promise<number>} - Number of affected rows
     */
    static async removeRole(userId, roleId) {
        try {
            return await db('user_roles')
                .where({
                    user_id: userId,
                    role_id: roleId
                })
                .delete();
        } catch (error) {
            console.error('Error removing role from user:', error);
            throw error;
        }
    }

    /**
     * Find user by ID with roles
     * @param {number} userId - User ID
     * @returns {Promise<Object|null>}
     */
    static async findById(userId) {
        try {
            const user = await db('users')
                .where('id', userId)
                .first();

            if (!user) return null;

            // Get user roles
            user.roles = await User.getUserRoles(userId);

            return user;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    /**
     * Get all users with pagination
     * @param {number} page - Page number (starts from 1)
     * @param {number} limit - Number of items per page
     * @param {Object} filters - Optional filters
     * @returns {Promise<{users: Array, total: number, page: number, totalPages: number}>}
     */
    static async getAll(page = 1, limit = 10, filters = {}) {
        try {
            // Calculate offset
            const offset = (page - 1) * limit;

            // Build query
            let query = db('users');

            // Apply filters
            if (filters.username) {
                query = query.where('username', 'like', `%${filters.username}%`);
            }

            if (filters.email) {
                query = query.where('email', 'like', `%${filters.email}%`);
            }

            if (filters.isActive !== undefined) {
                query = query.where('is_active', filters.isActive);
            }

            if (filters.isApproved !== undefined) {
                query = query.where('is_approved', filters.isApproved);
            }

            // Get total count
            const countQuery = query.clone().clearSelect().count('id as count');
            const [{count}] = await countQuery;

            // Get paginated results
            const users = await query
                .select('*')
                .limit(limit)
                .offset(offset)
                .orderBy('id', 'desc');

            // Calculate total pages
            const totalPages = Math.ceil(count / limit);

            return {
                users,
                total: count,
                page,
                totalPages
            };
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }
}

module.exports = User;