/**
 * Role model using Knex.js
 */
const db = require('@config/knex');

class Role {
  /**
   * Find role by ID
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    try {
      const role = await db('roles')
        .where({ id })
        .first();
      
      return role || null;
    } catch (error) {
      console.error('Error finding role by ID:', error);
      throw error;
    }
  }

  /**
   * Find role by name
   * @param {string} name 
   * @returns {Promise<Object|null>}
   */
  static async findByName(name) {
    try {
      const role = await db('roles')
        .where({ name })
        .first();
      
      return role || null;
    } catch (error) {
      console.error('Error finding role by name:', error);
      throw error;
    }
  }

  /**
   * Get all roles
   * @returns {Promise<Array>}
   */
  static async getAll() {
    try {
      return await db('roles')
        .select('*')
        .orderBy('id');
    } catch (error) {
      console.error('Error getting all roles:', error);
      throw error;
    }
  }

  /**
   * Create a new role
   * @param {Object} roleData - Role data
   * @returns {Promise<number>} - New role ID
   */
  static async create(roleData) {
    try {
      const [id] = await db('roles').insert(roleData);
      return id;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  /**
   * Update role
   * @param {number} roleId - Role ID
   * @param {Object} roleData - Role data to update
   * @returns {Promise<number>} - Number of affected rows
   */
  static async update(roleId, roleData) {
    try {
      return await db('roles')
        .where('id', roleId)
        .update(roleData);
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  /**
   * Delete role
   * @param {number} roleId - Role ID
   * @returns {Promise<number>} - Number of affected rows
   */
  static async delete(roleId) {
    try {
      return await db('roles')
        .where('id', roleId)
        .delete();
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  /**
   * Get role permissions
   * @param {number} roleId - Role ID
   * @returns {Promise<Array>}
   */
  static async getRolePermissions(roleId) {
    try {
      const permissions = await db('permissions as p')
        .join('role_permissions as rp', 'p.id', 'rp.permission_id')
        .where('rp.role_id', roleId)
        .select('p.id', 'p.name', 'p.description');
      
      return permissions;
    } catch (error) {
      console.error('Error getting role permissions:', error);
      throw error;
    }
  }

  /**
   * Assign permission to role
   * @param {number} roleId - Role ID
   * @param {number} permissionId - Permission ID
   * @returns {Promise<void>}
   */
  static async assignPermission(roleId, permissionId) {
    try {
      // Check if the permission assignment already exists
      const exists = await db('role_permissions')
        .where({
          role_id: roleId,
          permission_id: permissionId
        })
        .first();

      if (!exists) {
        await db('role_permissions').insert({
          role_id: roleId,
          permission_id: permissionId
        });
      }
    } catch (error) {
      console.error('Error assigning permission to role:', error);
      throw error;
    }
  }

  /**
   * Remove permission from role
   * @param {number} roleId - Role ID
   * @param {number} permissionId - Permission ID
   * @returns {Promise<number>} - Number of affected rows
   */
  static async removePermission(roleId, permissionId) {
    try {
      return await db('role_permissions')
        .where({
          role_id: roleId,
          permission_id: permissionId
        })
        .delete();
    } catch (error) {
      console.error('Error removing permission from role:', error);
      throw error;
    }
  }

  /**
   * Get users with role
   * @param {number} roleId - Role ID
   * @returns {Promise<Array>}
   */
  static async getUsersWithRole(roleId) {
    try {
      const users = await db('users as u')
        .join('user_roles as ur', 'u.id', 'ur.user_id')
        .where('ur.role_id', roleId)
        .select('u.id', 'u.username', 'u.email', 'u.full_name');
      
      return users;
    } catch (error) {
      console.error('Error getting users with role:', error);
      throw error;
    }
  }
}

module.exports = Role;