const knex = require('@config/knex');
const TABLE_NAME = 'activity_logs';

/**
 * Log activity
 * @param {Object} activity - Activity data
 * @param {number} activity.user_id - User ID (optional)
 * @param {string} activity.action - Action performed
 * @param {string} activity.entity_type - Entity type
 * @param {number} activity.entity_id - Entity ID (optional)
 * @param {Object} activity.details - Additional details (will be stringified)
 * @param {string} activity.ip_address - IP address (optional)
 * @returns {Promise<number>} - ID of created activity log
 */
const log = async (activity) => {
    try {
        const [id] = await knex(TABLE_NAME).insert({
            user_id: activity.user_id || null,
            action: activity.action,
            entity_type: activity.entity_type,
            entity_id: activity.entity_id || null,
            details: activity.details ? JSON.stringify(activity.details) : null,
            ip_address: activity.ip_address || null,
            created_at: knex.fn.now()
        });

        return id;
    } catch (error) {
        console.error('Error logging activity:', error);
        // Don't throw error to prevent disrupting the main flow
        return null;
    }
};

/**
 * Get activity logs with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Items per page
 * @param {number} options.userId - Filter by user ID
 * @param {string} options.entityType - Filter by entity type
 * @param {number} options.entityId - Filter by entity ID
 * @param {string} options.action - Filter by action
 * @param {string} options.startDate - Filter by start date
 * @param {string} options.endDate - Filter by end date
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, total: number, page: number, limit: number}>}
 */
const getActivityLogs = async (options = {}) => {
    const {
        page = 1,
        limit = 10,
        userId,
        entityType,
        entityId,
        action,
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
            knex.raw(`CONCAT(u.first_name, ' ', u.last_name) as user_name`),
            'u.email as user_email'
        ])
        .leftJoin('users as u', `${TABLE_NAME}.user_id`, 'u.id');

    // Apply filters
    if (userId) {
        query.where('user_id', userId);
    }

    if (entityType) {
        query.where('entity_type', entityType);
    }

    if (entityId) {
        query.where('entity_id', entityId);
    }

    if (action) {
        query.where('action', 'like', `%${action}%`);
    }

    // Apply date filters
    if (startDate && endDate) {
        query.whereBetween(`${TABLE_NAME}.created_at`, [startDate, endDate]);
    } else if (startDate) {
        query.where(`${TABLE_NAME}.created_at`, '>=', startDate);
    } else if (endDate) {
        query.where(`${TABLE_NAME}.created_at`, '<=', endDate);
    }

    // Get total count for pagination
    const countQuery = query.clone().clearSelect().count('id as count');
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

module.exports = {
    log,
    getActivityLogs
};