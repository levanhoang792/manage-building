/**
 * Authentication model using Knex.js
 * Contains complex queries involving users, roles and permissions
 */
const db = require('@config/knex');
const bcrypt = require('bcrypt');

class Auth {
    /**
     * Register a new user with roles
     * @param {Object} userData - User data
     * @param {Array} roleIds - Role IDs to assign
     * @returns {Promise<Object>} - Created user with roles
     */
    static async register(userData, roleIds = []) {
        // Start a transaction
        const trx = await db.transaction();

        try {
            // Hash password if provided
            if (userData.password) {
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(userData.password, salt);
            }

            // Insert user
            const [userId] = await trx('users').insert(userData);

            // Assign roles if provided
            if (roleIds.length > 0) {
                const userRoles = roleIds.map(roleId => ({
                    user_id: userId,
                    role_id: roleId
                }));

                await trx('user_roles').insert(userRoles);
            }

            // Commit transaction
            await trx.commit();

            // Get created user with roles
            const user = await db('users')
                .where('id', userId)
                .first();

            const roles = await db('roles as r')
                .join('user_roles as ur', 'r.id', 'ur.role_id')
                .where('ur.user_id', userId)
                .select('r.id', 'r.name', 'r.description');

            return {...user, roles};
        } catch (error) {
            // Rollback transaction on error
            await trx.rollback();
            console.error('Error registering user:', error);
            throw error;
        }
    }

    /**
     * Change user password
     * @param {number} userId - User ID
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<boolean>} - Success status
     */
    static async changePassword(userId, currentPassword, newPassword) {
        try {
            // Get user
            const user = await db('users')
                .where('id', userId)
                .first();

            if (!user) {
                throw new Error('User not found');
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return false;
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            await db('users')
                .where('id', userId)
                .update({password: hashedPassword});

            return true;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    /**
     * Reset user password (admin function)
     * @param {number} userId - User ID
     * @param {string} newPassword - New password
     * @returns {Promise<boolean>} - Success status
     */
    static async resetPassword(userId, newPassword) {
        try {
            // Get user
            const user = await db('users')
                .where('id', userId)
                .first();

            if (!user) {
                throw new Error('User not found');
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            await db('users')
                .where('id', userId)
                .update({password: hashedPassword});

            return true;
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }

    /**
     * Check if user has specific roles
     * @param {number} userId - User ID
     * @param {Array} roleNames - Role names to check
     * @returns {Promise<boolean>} - True if user has any of the roles
     */
    static async hasRoles(userId, roleNames) {
        try {
            const count = await db('roles as r')
                .join('user_roles as ur', 'r.id', 'ur.role_id')
                .where('ur.user_id', userId)
                .whereIn('r.name', roleNames)
                .count('r.id as count')
                .first();

            return count.count > 0;
        } catch (error) {
            console.error('Error checking user roles:', error);
            throw error;
        }
    }

    /**
     * Check if user has specific permissions
     * @param {number} userId - User ID
     * @param {Array} permissionNames - Permission names to check
     * @returns {Promise<boolean>} - True if user has all permissions
     */
    static async hasPermissions(userId, permissionNames) {
        try {
            // Get all user permissions
            const permissions = await db('permissions as p')
                .join('role_permissions as rp', 'p.id', 'rp.permission_id')
                .join('user_roles as ur', 'rp.role_id', 'ur.role_id')
                .where('ur.user_id', userId)
                .distinct('p.name')
                .pluck('p.name');

            // Check if user has all required permissions
            return permissionNames.every(permission => permissions.includes(permission));
        } catch (error) {
            console.error('Error checking user permissions:', error);
            throw error;
        }
    }

    /**
     * Get user details with roles and permissions
     * @param {number} userId - User ID
     * @returns {Promise<Object>} - User with roles and permissions
     */
    static async getUserDetails(userId) {
        try {
            // Get user
            const user = await db('users')
                .where('id', userId)
                .first();

            if (!user) {
                return null;
            }

            // Get user roles
            const roles = await db('roles as r')
                .join('user_roles as ur', 'r.id', 'ur.role_id')
                .where('ur.user_id', userId)
                .select('r.id', 'r.name', 'r.description');

            // Get user permissions
            const permissions = await db('permissions as p')
                .join('role_permissions as rp', 'p.id', 'rp.permission_id')
                .join('user_roles as ur', 'rp.role_id', 'ur.role_id')
                .where('ur.user_id', userId)
                .distinct('p.id', 'p.name', 'p.description');

            return {
                ...user,
                roles,
                permissions
            };
        } catch (error) {
            console.error('Error getting user details:', error);
            throw error;
        }
    }
}

module.exports = Auth;