const knex = require('../config/knex');
const TABLE_NAME = 'buildings';

/**
 * Get all buildings with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.search - Search term for name or address
 * @param {string} options.status - Filter by status
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, total: number, page: number, limit: number}>}
 */
const getAll = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  const offset = (page - 1) * limit;
  
  // Build query
  const query = knex(TABLE_NAME)
    .select('*');
  
  // Apply filters
  if (search) {
    query.where(builder => {
      builder.where('name', 'like', `%${search}%`)
        .orWhere('address', 'like', `%${search}%`);
    });
  }
  
  if (status) {
    query.where('status', status);
  }
  
  // Get total count for pagination
  const countQuery = query.clone();
  const [{ count }] = await countQuery.count('id as count');
  
  // Apply pagination and sorting
  const data = await query
    .orderBy(sortBy, sortOrder)
    .limit(limit)
    .offset(offset);
  
  return {
    data,
    total: parseInt(count),
    page: parseInt(page),
    limit: parseInt(limit)
  };
};

/**
 * Get building by ID
 * @param {number} id - Building ID
 * @returns {Promise<Object>}
 */
const getById = async (id) => {
  return knex(TABLE_NAME)
    .where('id', id)
    .first();
};

/**
 * Create new building
 * @param {Object} building - Building data
 * @returns {Promise<number>} - ID of created building
 */
const create = async (building) => {
  const [id] = await knex(TABLE_NAME)
    .insert({
      ...building,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });
  
  return id;
};

/**
 * Update building
 * @param {number} id - Building ID
 * @param {Object} building - Building data to update
 * @returns {Promise<number>} - Number of updated rows
 */
const update = async (id, building) => {
  return knex(TABLE_NAME)
    .where('id', id)
    .update({
      ...building,
      updated_at: knex.fn.now()
    });
};

/**
 * Update building status
 * @param {number} id - Building ID
 * @param {string} status - New status
 * @returns {Promise<number>} - Number of updated rows
 */
const updateStatus = async (id, status) => {
  return knex(TABLE_NAME)
    .where('id', id)
    .update({
      status,
      updated_at: knex.fn.now()
    });
};

/**
 * Delete building
 * @param {number} id - Building ID
 * @returns {Promise<number>} - Number of deleted rows
 */
const remove = async (id) => {
  return knex(TABLE_NAME)
    .where('id', id)
    .del();
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  updateStatus,
  remove
};