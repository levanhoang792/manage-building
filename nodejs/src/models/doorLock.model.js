const knex = require('@config/knex');
const TABLE_NAME = 'doors';
const HISTORY_TABLE = 'door_lock_history';

/**
 * Update door lock status
 * @param {number} floorId - Floor ID
 * @param {number} doorId - Door ID
 * @param {string} lockStatus - New lock status ('open' or 'closed')
 * @param {number} userId - User ID who changed the status
 * @param {number} requestId - Optional request ID if status change is due to a request
 * @param {string} reason - Optional reason for status change
 * @returns {Promise<number>} - Number of updated rows
 */
const updateLockStatus = async (floorId, doorId, lockStatus, userId, requestId = null, reason = null) => {
    // Start a transaction
    const trx = await knex.transaction();

    try {
        // Get current door status
        const door = await trx(TABLE_NAME)
            .where({
                'floor_id': floorId,
                'id': doorId
            })
            .first();

        if (!door) {
            throw new Error('Door not found');
        }

        const previousStatus = door.lock_status;

        // Update door lock status
        await trx(TABLE_NAME)
            .where({
                'floor_id': floorId,
                'id': doorId
            })
            .update({
                lock_status: lockStatus,
                updated_at: trx.fn.now()
            });

        // Create history record manually (in addition to trigger)
        await trx(HISTORY_TABLE).insert({
            door_id: doorId,
            previous_status: previousStatus,
            new_status: lockStatus,
            changed_by: userId,
            request_id: requestId,
            reason: reason,
            created_at: trx.fn.now()
        });

        // Commit transaction
        await trx.commit();

        return 1;
    } catch (error) {
        // Rollback transaction on error
        await trx.rollback();
        throw error;
    }
};

/**
 * Get door lock history
 * @param {number} doorId - Door ID
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {string} options.startDate - Filter by start date
 * @param {string} options.endDate - Filter by end date
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, total: number, page: number, limit: number}>}
 */
const getLockHistory = async (doorId, options = {}) => {
    const {
        page = 1,
        limit = 10,
        startDate,
        endDate,
        sortBy = 'created_at',
        sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;

    // Build query
    const query = knex(HISTORY_TABLE)
        .select([
            `${HISTORY_TABLE}.*`,
            knex.raw(`CONCAT(u.first_name, ' ', u.last_name) as changed_by_name`),
            'u.email as changed_by_email',
            'dr.requester_name',
            'dr.purpose'
        ])
        .leftJoin('users as u', `${HISTORY_TABLE}.changed_by`, 'u.id')
        .leftJoin('door_requests as dr', `${HISTORY_TABLE}.request_id`, 'dr.id')
        .where('door_id', doorId);

    // Apply date filters
    if (startDate && endDate) {
        query.whereBetween(`${HISTORY_TABLE}.created_at`, [startDate, endDate]);
    } else if (startDate) {
        query.where(`${HISTORY_TABLE}.created_at`, '>=', startDate);
    } else if (endDate) {
        query.where(`${HISTORY_TABLE}.created_at`, '<=', endDate);
    }

    // Get total count for pagination
    const countQuery = query.clone().clearSelect().count('id as count');
    const [{ count }] = await countQuery;

    // Apply pagination and sorting
    const data = await query
        .orderBy(`${HISTORY_TABLE}.${sortBy}`, sortOrder)
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
 * Get current lock status of a door
 * @param {number} floorId - Floor ID
 * @param {number} doorId - Door ID
 * @returns {Promise<string>} - Lock status ('open' or 'closed')
 */
const getLockStatus = async (floorId, doorId) => {
    const door = await knex(TABLE_NAME)
        .where({
            'floor_id': floorId,
            'id': doorId
        })
        .select('lock_status')
        .first();

    if (!door) {
        throw new Error('Door not found');
    }

    return door.lock_status;
};

module.exports = {
    updateLockStatus,
    getLockHistory,
    getLockStatus
};