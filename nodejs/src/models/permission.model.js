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
        .where({ id })
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
        .where({ name })
        .first();
      
      return permission || null;
    } catch (error) {
      console.error('Error finding permission by name:', error);
      throw error;
    }
  }

  /**
   * Get all permissions
   * @returns {Promise<Array>}
   */
  static async getAll() {
    try {
      return await db('permissions')
        .select('*')
        .orderBy('id');
    } catch (error) {
      console.error('Error getting all permissions:', error);
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
      const roles = await db('roles as r')
        .join('role_permissions as rp', 'r.id', 'rp.role_id')
        .where('rp.permission_id', permissionId)
        .select('r.id', 'r.name', 'r.description');
      
      return roles;
    } catch (error) {
      console.error('Error getting roles with permission:', error);
      throw error;
    }
  }
}

module.exports = Permission;