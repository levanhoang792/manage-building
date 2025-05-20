const knex = require('@config/knex');
const TABLE_NAME = 'door_requests';

/**
 * Get all door requests with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.status - Filter by status
 * @param {number} options.buildingId - Filter by building ID
 * @param {number} options.floorId - Filter by floor ID
 * @param {number} options.doorId - Filter by door ID
 * @param {string} options.search - Search term for requester name or purpose
 * @param {string} options.startDate - Filter by start date
 * @param {string} options.endDate - Filter by end date
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, total: number, page: number, limit: number}>}
 */
const getAll = async (options = {}) => {
    const {
        page = 1,
        limit = 10,
        status,
        buildingId,
        floorId,
        doorId,
        search = '',
        startDate,
        endDate,
        sortBy = 'created_at',
        sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;

    // Build query
    const query = knex(TABLE_NAME)
        .select([
            `${TABLE_NAME}.*`,
            'd.name as door_name',
            'f.name as floor_name',
            'f.floor_number',
            'b.name as building_name',
            'u.full_name as processed_by_name', // Changed from CONCAT(first_name, last_name)
            'u.email as processed_by_email'
        ])
        .leftJoin('doors as d', `${TABLE_NAME}.door_id`, 'd.id')
        .leftJoin('floors as f', 'd.floor_id', 'f.id')
        .leftJoin('buildings as b', 'f.building_id', 'b.id')
        .leftJoin('users as u', `${TABLE_NAME}.processed_by`, 'u.id');

    // Apply filters
    if (status) {
        query.where(`${TABLE_NAME}.status`, status);
    }

    if (doorId) {
        query.where(`${TABLE_NAME}.door_id`, doorId);
    }

    if (floorId) {
        query.where('f.id', floorId);
    }

    if (buildingId) {
        query.where('b.id', buildingId);
    }

    if (search) {
        query.where(function() {
            this.where(`${TABLE_NAME}.requester_name`, 'like', `%${search}%`)
                .orWhere(`${TABLE_NAME}.purpose`, 'like', `%${search}%`)
                .orWhere(`${TABLE_NAME}.requester_email`, 'like', `%${search}%`)
                .orWhere(`${TABLE_NAME}.requester_phone`, 'like', `%${search}%`);
        });
    }

    // Apply date filters
    if (startDate && endDate) {
        query.whereBetween(`${TABLE_NAME}.created_at`, [startDate, endDate]);
    } else if (startDate) {
        query.where(`${TABLE_NAME}.created_at`, '>=', startDate);
    } else if (endDate) {
        query.where(`${TABLE_NAME}.created_at`, '<=', endDate);
    }

    // Get total count for pagination - FIX: Specify table name for id column
    const countQuery = query.clone().clearSelect().count(`${TABLE_NAME}.id as count`);
    const [{ count }] = await countQuery;

    // Apply pagination and sorting
    const data = await query
        .orderBy(`${TABLE_NAME}.${sortBy}`, sortOrder)
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
 * Get door request by ID
 * @param {number} id - Request ID
 * @returns {Promise<Object>}
 */
const getById = async (id) => {
    return knex(TABLE_NAME)
        .select([
            `${TABLE_NAME}.*`,
            'd.name as door_name',
            'f.name as floor_name',
            'f.floor_number',
            'b.name as building_name',
            'u.full_name as processed_by_name', // Changed from CONCAT(first_name, last_name)
            'u.email as processed_by_email'
        ])
        .leftJoin('doors as d', `${TABLE_NAME}.door_id`, 'd.id')
        .leftJoin('floors as f', 'd.floor_id', 'f.id')
        .leftJoin('buildings as b', 'f.building_id', 'b.id')
        .leftJoin('users as u', `${TABLE_NAME}.processed_by`, 'u.id')
        .where(`${TABLE_NAME}.id`, id)
        .first();
};

/**
 * Get door requests for a specific door
 * @param {number} doorId - Door ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.status - Filter by status
 * @param {string} options.startDate - Filter by start date
 * @param {string} options.endDate - Filter by end date
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, total: number, page: number, limit: number}>}
 */
const getByDoorId = async (doorId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        status,
        startDate,
        endDate,
        sortBy = 'created_at',
        sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;

    // Build query
    const query = knex(TABLE_NAME)
        .select([
            `${TABLE_NAME}.*`,
            'u.full_name as processed_by_name', // Changed from CONCAT(first_name, last_name)
            'u.email as processed_by_email'
        ])
        .leftJoin('users as u', `${TABLE_NAME}.processed_by`, 'u.id')
        .where('door_id', doorId);

    // Apply filters
    if (status) {
        query.where('status', status);
    }

    // Apply date filters
    if (startDate && endDate) {
        query.whereBetween(`${TABLE_NAME}.created_at`, [startDate, endDate]);
    } else if (startDate) {
        query.where(`${TABLE_NAME}.created_at`, '>=', startDate);
    } else if (endDate) {
        query.where(`${TABLE_NAME}.created_at`, '<=', endDate);
    }

    // Get total count for pagination - FIX: Specify table name for id column
    const countQuery = query.clone().clearSelect().count(`${TABLE_NAME}.id as count`);
    const [{ count }] = await countQuery;

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
 * Create new door request
 * @param {Object} request - Request data
 * @returns {Promise<number>} - ID of created request
 */
const create = async (request) => {
    const [id] = await knex(TABLE_NAME)
        .insert({
            ...request,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        });

    return id;
};

/**
 * Update door request status
 * @param {number} id - Request ID
 * @param {string} status - New status ('approved' or 'rejected')
 * @param {number} userId - User ID who processed the request
 * @param {string} reason - Reason for approval or rejection
 * @returns {Promise<number>} - Number of updated rows
 */
const updateStatus = async (id, status, userId, reason) => {
    return knex(TABLE_NAME)
        .where('id', id)
        .update({
            status,
            processed_by: userId,
            processed_at: knex.fn.now(),
            updated_at: knex.fn.now(),
            reason: reason || null
        });
};

/**
 * Get latest pending request for a door
 * @param {number} doorId - Door ID
 * @returns {Promise<Object|null>} Latest pending request or null if none exists
 */
const getLatestPendingByDoorId = async (doorId) => {
    return knex(TABLE_NAME)
        .select([
            `${TABLE_NAME}.*`,
            'd.name as door_name',
            'f.name as floor_name',
            'f.floor_number',
            'b.name as building_name'
        ])
        .leftJoin('doors as d', `${TABLE_NAME}.door_id`, 'd.id')
        .leftJoin('floors as f', 'd.floor_id', 'f.id')
        .leftJoin('buildings as b', 'f.building_id', 'b.id')
        .where({
            [`${TABLE_NAME}.door_id`]: doorId,
            [`${TABLE_NAME}.status`]: 'pending'
        })
        .orderBy(`${TABLE_NAME}.created_at`, 'desc')
        .first();
};

module.exports = {
    getAll,
    getById,
    getByDoorId,
    create,
    updateStatus,
    getLatestPendingByDoorId
};