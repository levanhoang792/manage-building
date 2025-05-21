const knex = require('@config/knex');
const TABLE_NAME = 'doors';

/**
 * Get all doors for a floor with pagination and filtering
 * @param {number} floorId - Floor ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.search - Search term for name
 * @param {string} options.type - Filter by door type
 * @param {string} options.status - Filter by status
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, total: number, page: number, limit: number}>}
 */
const getAllByFloor = async (floorId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        type,
        status,
        sortBy = 'created_at',
        sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;

    // Build query
    const query = knex(TABLE_NAME)
        .select('*')
        .where('floor_id', floorId);

    // Apply filters
    if (search) {
        query.where('name', 'like', `%${search}%`);
    }

    if (type) {
        query.where('type', type);
    }

    if (status) {
        query.where('status', status);
    }

    // Get total count for pagination
    const countQuery = query.clone().clearSelect().count('id as count');
    const [{count}] = await countQuery;

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
 * Get door by ID
 * @param {number} floorId - Floor ID (optional)
 * @param {number} id - Door ID
 * @returns {Promise<Object>}
 */
const getById = async (floorId, id) => {
    const query = knex(TABLE_NAME)
        .select('*')
        .where('id', id);

    if (floorId) {
        query.where('floor_id', floorId);
    }

    return query.first();
};

/**
 * Create new door
 * @param {Object} door - Door data
 * @returns {Promise<number>} - ID of created door
 */
const create = async (door) => {
    const [id] = await knex(TABLE_NAME)
        .insert({
            ...door,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        });

    return id;
};

/**
 * Update door
 * @param {number} floorId - Floor ID
 * @param {number} id - Door ID
 * @param {Object} door - Door data to update
 * @returns {Promise<number>} - Number of updated rows
 */
const update = async (floorId, id, door) => {
    const query = knex(TABLE_NAME)
        .where('id', id)
        .update({
            ...door,
            updated_at: knex.fn.now()
        });

    if (floorId) {
        query.where('floor_id', floorId);
    }

    return query;
};

/**
 * Update door status
 * @param {number} floorId - Floor ID
 * @param {number} id - Door ID
 * @param {string} status - New status
 * @returns {Promise<number>} - Number of updated rows
 */
const updateStatus = async (floorId, id, status) => {
    const query = knex(TABLE_NAME)
        .where('id', id)
        .update({
            status,
            updated_at: knex.fn.now()
        });

    if (floorId) {
        query.where('floor_id', floorId);
    }

    return query;
};

/**
 * Update door lock status
 * @param {number} floorId - Floor ID
 * @param {number} id - Door ID
 * @param {string} lockStatus - New lock status
 * @returns {Promise<number>} - Number of updated rows
 */
const updateLockStatus = async (floorId, id, lockStatus) => {
    const query = knex(TABLE_NAME)
        .where('id', id)
        .update({
            lock_status: lockStatus,
            updated_at: knex.fn.now()
        });

    if (floorId) {
        query.where('floor_id', floorId);
    }

    return query;
};

/**
 * Update door ThingsBoard information
 * @param {number} id - Door ID
 * @param {string} deviceId - ThingsBoard device ID
 * @param {string} accessToken - ThingsBoard access token
 * @returns {Promise<void>}
 */
const updateThingsBoardInfo = async (id, deviceId, accessToken) => {
    return knex(TABLE_NAME)
        .where('id', id)
        .update({
            thingsboard_device_id: deviceId,
            thingsboard_access_token: accessToken,
            updated_at: knex.fn.now()
        });
};

/**
 * Delete door
 * @param {number} floorId - Floor ID
 * @param {number} id - Door ID
 * @returns {Promise<number>} - Number of deleted rows
 */
const remove = async (floorId, id) => {
    const query = knex(TABLE_NAME)
        .where('id', id)
        .del();

    if (floorId) {
        query.where('floor_id', floorId);
    }

    return query;
};

module.exports = {
    getAllByFloor,
    getById,
    create,
    update,
    updateStatus,
    updateLockStatus,
    updateThingsBoardInfo,
    remove
};
