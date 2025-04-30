const knex = require('../config/knex');
const TABLE_NAME = 'floors';

/**
 * Get all floors for a building with pagination and filtering
 * @param {number} buildingId - Building ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.search - Search term for name
 * @param {string} options.status - Filter by status
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, total: number, page: number, limit: number}>}
 */
const getAllByBuilding = async (buildingId, options = {}) => {
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
    .select('*')
    .where('building_id', buildingId);
  
  // Apply filters
  if (search) {
    query.where('name', 'like', `%${search}%`);
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
 * Get floor by ID
 * @param {number} buildingId - Building ID
 * @param {number} id - Floor ID
 * @returns {Promise<Object>}
 */
const getById = async (buildingId, id) => {
  return knex(TABLE_NAME)
    .where({
      'building_id': buildingId,
      'id': id
    })
    .first();
};

/**
 * Create new floor
 * @param {Object} floor - Floor data
 * @returns {Promise<number>} - ID of created floor
 */
const create = async (floor) => {
  const [id] = await knex(TABLE_NAME)
    .insert({
      ...floor,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });
  
  return id;
};

/**
 * Update floor
 * @param {number} buildingId - Building ID
 * @param {number} id - Floor ID
 * @param {Object} floor - Floor data to update
 * @returns {Promise<number>} - Number of updated rows
 */
const update = async (buildingId, id, floor) => {
  return knex(TABLE_NAME)
    .where({
      'building_id': buildingId,
      'id': id
    })
    .update({
      ...floor,
      updated_at: knex.fn.now()
    });
};

/**
 * Update floor plan image
 * @param {number} buildingId - Building ID
 * @param {number} id - Floor ID
 * @param {string} imagePath - Path to floor plan image
 * @returns {Promise<number>} - Number of updated rows
 */
const updateFloorPlan = async (buildingId, id, imagePath) => {
  return knex(TABLE_NAME)
    .where({
      'building_id': buildingId,
      'id': id
    })
    .update({
      floor_plan_image: imagePath,
      updated_at: knex.fn.now()
    });
};

/**
 * Update floor status
 * @param {number} buildingId - Building ID
 * @param {number} id - Floor ID
 * @param {string} status - New status
 * @returns {Promise<number>} - Number of updated rows
 */
const updateStatus = async (buildingId, id, status) => {
  return knex(TABLE_NAME)
    .where({
      'building_id': buildingId,
      'id': id
    })
    .update({
      status,
      updated_at: knex.fn.now()
    });
};

/**
 * Delete floor
 * @param {number} buildingId - Building ID
 * @param {number} id - Floor ID
 * @returns {Promise<number>} - Number of deleted rows
 */
const remove = async (buildingId, id) => {
  return knex(TABLE_NAME)
    .where({
      'building_id': buildingId,
      'id': id
    })
    .del();
};

module.exports = {
  getAllByBuilding,
  getById,
  create,
  update,
  updateFloorPlan,
  updateStatus,
  remove
};