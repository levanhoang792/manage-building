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

/**
 * Helper function to convert JSON data to CSV format
 * @param {Array} data - Array of objects to convert to CSV
 * @returns {string} - CSV formatted string
 */
const jsonToCsv = (data) => {
    if (!data || !data.length) {
        return '';
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV header row
    let csv = headers.join(',') + '\n';

    // Add data rows
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Handle null, undefined, and format objects/arrays
            if (value === null || value === undefined) {
                return '';
            } else if (typeof value === 'object') {
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            } else {
                return `"${String(value).replace(/"/g, '""')}"`;
            }
        });
        csv += values.join(',') + '\n';
    });

    return csv;
};

/**
 * Apply date filters to a query
 * @param {Object} query - Knex query object
 * @param {string} tableName - Table name
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {Object} - Modified query object
 */
const applyDateFilters = (query, tableName, startDate, endDate) => {
    if (startDate && endDate) {
        query.whereBetween(`${tableName}.created_at`, [startDate, endDate]);
    } else if (startDate) {
        query.where(`${tableName}.created_at`, '>=', startDate);
    } else if (endDate) {
        query.where(`${tableName}.created_at`, '<=', endDate);
    }
    return query;
};

/**
 * Generate summary report for door access
 * @param {number} buildingId - Building ID
 * @param {number} floorId - Floor ID
 * @param {string|number} doorId - Door ID or 'all'
 * @param {Object} options - Report options
 * @returns {Promise<Object>} - Report data
 */
const generateSummaryReport = async (buildingId, floorId, doorId, options = {}) => {
    const { start_date, end_date, format } = options;

    // Base query to get doors
    let doorsQuery = knex('doors')
        .join('floors', 'doors.floor_id', 'floors.id')
        .join('buildings', 'floors.building_id', 'buildings.id')
        .where('buildings.id', buildingId);

    if (floorId !== 'all') {
        doorsQuery.where('floors.id', floorId);
    }

    if (doorId !== 'all') {
        doorsQuery.where('doors.id', doorId);
    }

    // Get list of doors
    const doors = await doorsQuery.select('doors.id', 'doors.name');

    // Get access counts for each door
    const doorIds = doors.map(door => door.id);

    // Query to get total access counts
    let accessQuery = knex(HISTORY_TABLE)
        .whereIn('door_id', doorIds)
        .count('id as total_access_events')
        .select(
            knex.raw('COUNT(DISTINCT changed_by) as unique_users'),
            knex.raw('SUM(CASE WHEN new_status = "open" THEN 1 ELSE 0 END) as open_events'),
            knex.raw('SUM(CASE WHEN new_status = "closed" THEN 1 ELSE 0 END) as close_events')
        );

    // Apply date filters
    accessQuery = applyDateFilters(accessQuery, HISTORY_TABLE, start_date, end_date);

    // Get access counts
    const [accessCounts] = await accessQuery;

    // Get most active doors
    let mostActiveDoorsQuery = knex(HISTORY_TABLE)
        .join('doors', `${HISTORY_TABLE}.door_id`, 'doors.id')
        .whereIn('door_id', doorIds)
        .groupBy('door_id')
        .select(
            'door_id',
            'doors.name as door_name',
            knex.raw('COUNT(*) as access_count')
        )
        .orderBy('access_count', 'desc')
        .limit(5);

    // Apply date filters
    mostActiveDoorsQuery = applyDateFilters(mostActiveDoorsQuery, HISTORY_TABLE, start_date, end_date);

    // Get most active doors
    const mostActiveDoors = await mostActiveDoorsQuery;

    // Get most active users
    let mostActiveUsersQuery = knex(HISTORY_TABLE)
        .join('users', `${HISTORY_TABLE}.changed_by`, 'users.id')
        .whereIn('door_id', doorIds)
        .whereNotNull('changed_by')
        .groupBy('changed_by')
        .select(
            'changed_by',
            'users.full_name as user_name',
            'users.email as user_email',
            knex.raw('COUNT(*) as access_count')
        )
        .orderBy('access_count', 'desc')
        .limit(5);

    // Apply date filters
    mostActiveUsersQuery = applyDateFilters(mostActiveUsersQuery, HISTORY_TABLE, start_date, end_date);

    // Get most active users
    const mostActiveUsers = await mostActiveUsersQuery;

    // Get recent activity
    let recentActivityQuery = knex(HISTORY_TABLE)
        .join('doors', `${HISTORY_TABLE}.door_id`, 'doors.id')
        .leftJoin('users', `${HISTORY_TABLE}.changed_by`, 'users.id')
        .whereIn('door_id', doorIds)
        .select(
            `${HISTORY_TABLE}.id`,
            `${HISTORY_TABLE}.door_id`,
            'doors.name as door_name',
            `${HISTORY_TABLE}.previous_status`,
            `${HISTORY_TABLE}.new_status`,
            `${HISTORY_TABLE}.changed_by`,
            'users.full_name as user_name',
            `${HISTORY_TABLE}.reason`,
            `${HISTORY_TABLE}.created_at`
        )
        .orderBy(`${HISTORY_TABLE}.created_at`, 'desc')
        .limit(10);

    // Apply date filters
    recentActivityQuery = applyDateFilters(recentActivityQuery, HISTORY_TABLE, start_date, end_date);

    // Get recent activity
    const recentActivity = await recentActivityQuery;

    // Prepare report data
    const reportData = {
        report_type: 'summary',
        generated_at: new Date().toISOString(),
        period: {
            start_date: start_date || 'All time',
            end_date: end_date || 'All time'
        },
        summary: {
            total_doors: doors.length,
            total_access_events: parseInt(accessCounts.total_access_events) || 0,
            unique_users: parseInt(accessCounts.unique_users) || 0,
            open_events: parseInt(accessCounts.open_events) || 0,
            close_events: parseInt(accessCounts.close_events) || 0
        },
        most_active_doors: mostActiveDoors,
        most_active_users: mostActiveUsers,
        recent_activity: recentActivity
    };

    // Return CSV if requested
    if (format === 'csv') {
        // Flatten the data for CSV
        const flatData = [
            { 
                report_type: 'summary',
                generated_at: reportData.generated_at,
                start_date: reportData.period.start_date,
                end_date: reportData.period.end_date,
                total_doors: reportData.summary.total_doors,
                total_access_events: reportData.summary.total_access_events,
                unique_users: reportData.summary.unique_users,
                open_events: reportData.summary.open_events,
                close_events: reportData.summary.close_events
            }
        ];

        return jsonToCsv(flatData);
    }

    return reportData;
};

/**
 * Generate frequency report for door access
 * @param {number} buildingId - Building ID
 * @param {number} floorId - Floor ID
 * @param {string|number} doorId - Door ID or 'all'
 * @param {Object} options - Report options
 * @returns {Promise<Object>} - Report data
 */
const generateFrequencyReport = async (buildingId, floorId, doorId, options = {}) => {
    const { start_date, end_date, group_by, format } = options;

    // Determine the date format based on group_by
    let dateFormat;
    switch (group_by) {
        case 'hour':
            dateFormat = '%Y-%m-%d %H:00:00';
            break;
        case 'day':
            dateFormat = '%Y-%m-%d';
            break;
        case 'week':
            dateFormat = '%Y-%u'; // ISO week number
            break;
        case 'month':
            dateFormat = '%Y-%m';
            break;
        case 'year':
            dateFormat = '%Y';
            break;
        default:
            dateFormat = '%Y-%m-%d';
    }

    // Base query to get doors
    let doorsQuery = knex('doors')
        .join('floors', 'doors.floor_id', 'floors.id')
        .join('buildings', 'floors.building_id', 'buildings.id')
        .where('buildings.id', buildingId);

    if (floorId !== 'all') {
        doorsQuery.where('floors.id', floorId);
    }

    if (doorId !== 'all') {
        doorsQuery.where('doors.id', doorId);
    }

    // Get list of doors
    const doors = await doorsQuery.select('doors.id', 'doors.name');

    // Get access counts for each door
    const doorIds = doors.map(door => door.id);

    // Query to get frequency data
    let frequencyQuery = knex(HISTORY_TABLE)
        .whereIn('door_id', doorIds)
        .select(
            knex.raw(`DATE_FORMAT(created_at, '${dateFormat}') as time_period`),
            knex.raw('COUNT(*) as access_count'),
            knex.raw('SUM(CASE WHEN new_status = "open" THEN 1 ELSE 0 END) as open_events'),
            knex.raw('SUM(CASE WHEN new_status = "closed" THEN 1 ELSE 0 END) as close_events')
        )
        .groupBy('time_period')
        .orderBy('time_period', 'asc');

    // Apply date filters
    frequencyQuery = applyDateFilters(frequencyQuery, HISTORY_TABLE, start_date, end_date);

    // Get frequency data
    const frequencyData = await frequencyQuery;

    // Prepare report data
    const reportData = {
        report_type: 'frequency',
        generated_at: new Date().toISOString(),
        period: {
            start_date: start_date || 'All time',
            end_date: end_date || 'All time',
            group_by: group_by
        },
        doors: doors,
        frequency_data: frequencyData
    };

    // Return CSV if requested
    if (format === 'csv') {
        return jsonToCsv(frequencyData);
    }

    return reportData;
};

/**
 * Generate user activity report for door access
 * @param {number} buildingId - Building ID
 * @param {number} floorId - Floor ID
 * @param {string|number} doorId - Door ID or 'all'
 * @param {Object} options - Report options
 * @returns {Promise<Object>} - Report data
 */
const generateUserActivityReport = async (buildingId, floorId, doorId, options = {}) => {
    const { start_date, end_date, format } = options;

    // Base query to get doors
    let doorsQuery = knex('doors')
        .join('floors', 'doors.floor_id', 'floors.id')
        .join('buildings', 'floors.building_id', 'buildings.id')
        .where('buildings.id', buildingId);

    if (floorId !== 'all') {
        doorsQuery.where('floors.id', floorId);
    }

    if (doorId !== 'all') {
        doorsQuery.where('doors.id', doorId);
    }

    // Get list of doors
    const doors = await doorsQuery.select('doors.id', 'doors.name');

    // Get access counts for each door
    const doorIds = doors.map(door => door.id);

    // Query to get user activity data
    let userActivityQuery = knex(HISTORY_TABLE)
        .join('users', `${HISTORY_TABLE}.changed_by`, 'users.id')
        .whereIn('door_id', doorIds)
        .whereNotNull('changed_by')
        .groupBy('changed_by')
        .select(
            'changed_by',
            'users.full_name as user_name',
            'users.email as user_email',
            knex.raw('COUNT(*) as access_count'),
            knex.raw('SUM(CASE WHEN new_status = "open" THEN 1 ELSE 0 END) as open_events'),
            knex.raw('SUM(CASE WHEN new_status = "closed" THEN 1 ELSE 0 END) as close_events'),
            knex.raw(`MIN(${HISTORY_TABLE}.created_at) as first_access`),
            knex.raw(`MAX(${HISTORY_TABLE}.created_at) as last_access`)
        )
        .orderBy('access_count', 'desc');

    // Apply date filters
    userActivityQuery = applyDateFilters(userActivityQuery, HISTORY_TABLE, start_date, end_date);

    // Get user activity data
    const userActivityData = await userActivityQuery;

    // Prepare report data
    const reportData = {
        report_type: 'user_activity',
        generated_at: new Date().toISOString(),
        period: {
            start_date: start_date || 'All time',
            end_date: end_date || 'All time'
        },
        doors: doors,
        user_activity: userActivityData
    };

    // Return CSV if requested
    if (format === 'csv') {
        return jsonToCsv(userActivityData);
    }

    return reportData;
};

/**
 * Generate time analysis report for door access
 * @param {number} buildingId - Building ID
 * @param {number} floorId - Floor ID
 * @param {string|number} doorId - Door ID or 'all'
 * @param {Object} options - Report options
 * @returns {Promise<Object>} - Report data
 */
const generateTimeAnalysisReport = async (buildingId, floorId, doorId, options = {}) => {
    const { start_date, end_date, format } = options;

    // Base query to get doors
    let doorsQuery = knex('doors')
        .join('floors', 'doors.floor_id', 'floors.id')
        .join('buildings', 'floors.building_id', 'buildings.id')
        .where('buildings.id', buildingId);

    if (floorId !== 'all') {
        doorsQuery.where('floors.id', floorId);
    }

    if (doorId !== 'all') {
        doorsQuery.where('doors.id', doorId);
    }

    // Get list of doors
    const doors = await doorsQuery.select('doors.id', 'doors.name');

    // Get access counts for each door
    const doorIds = doors.map(door => door.id);

    // Query to get hourly distribution
    let hourlyQuery = knex(HISTORY_TABLE)
        .whereIn('door_id', doorIds)
        .select(
            knex.raw('HOUR(created_at) as hour_of_day'),
            knex.raw('COUNT(*) as access_count')
        )
        .groupBy('hour_of_day')
        .orderBy('hour_of_day', 'asc');

    // Apply date filters
    hourlyQuery = applyDateFilters(hourlyQuery, HISTORY_TABLE, start_date, end_date);

    // Get hourly distribution
    const hourlyDistribution = await hourlyQuery;

    // Query to get daily distribution
    let dailyQuery = knex(HISTORY_TABLE)
        .whereIn('door_id', doorIds)
        .select(
            knex.raw('DAYOFWEEK(created_at) as day_of_week'),
            knex.raw('COUNT(*) as access_count')
        )
        .groupBy('day_of_week')
        .orderBy('day_of_week', 'asc');

    // Apply date filters
    dailyQuery = applyDateFilters(dailyQuery, HISTORY_TABLE, start_date, end_date);

    // Get daily distribution
    const dailyDistribution = await dailyQuery;

    // Map day numbers to day names
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mappedDailyDistribution = dailyDistribution.map(item => ({
        day_of_week: dayNames[item.day_of_week - 1],
        day_number: item.day_of_week,
        access_count: item.access_count
    }));

    // Prepare report data
    const reportData = {
        report_type: 'time_analysis',
        generated_at: new Date().toISOString(),
        period: {
            start_date: start_date || 'All time',
            end_date: end_date || 'All time'
        },
        doors: doors,
        hourly_distribution: hourlyDistribution,
        daily_distribution: mappedDailyDistribution
    };

    // Return CSV if requested
    if (format === 'csv') {
        // Combine hourly and daily data for CSV
        const hourlyData = hourlyDistribution.map(item => ({
            time_period: 'hour',
            period_value: item.hour_of_day,
            period_name: `${item.hour_of_day}:00`,
            access_count: item.access_count
        }));

        const dailyData = mappedDailyDistribution.map(item => ({
            time_period: 'day',
            period_value: item.day_number,
            period_name: item.day_of_week,
            access_count: item.access_count
        }));

        return jsonToCsv([...hourlyData, ...dailyData]);
    }

    return reportData;
};

/**
 * Generate door comparison report
 * @param {number} buildingId - Building ID
 * @param {number} floorId - Floor ID
 * @param {Object} options - Report options
 * @returns {Promise<Object>} - Report data
 */
const generateDoorComparisonReport = async (buildingId, floorId, options = {}) => {
    const { start_date, end_date, format } = options;

    // Base query to get doors
    let doorsQuery = knex('doors')
        .join('floors', 'doors.floor_id', 'floors.id')
        .join('buildings', 'floors.building_id', 'buildings.id')
        .where('buildings.id', buildingId);

    if (floorId !== 'all') {
        doorsQuery.where('floors.id', floorId);
    }

    // Get list of doors
    const doors = await doorsQuery.select('doors.id', 'doors.name');

    // Get access counts for each door
    const doorIds = doors.map(door => door.id);

    // Query to get door comparison data
    let doorComparisonQuery = knex(HISTORY_TABLE)
        .join('doors', `${HISTORY_TABLE}.door_id`, 'doors.id')
        .join('floors', 'doors.floor_id', 'floors.id')
        .whereIn('door_id', doorIds)
        .groupBy('door_id')
        .select(
            'door_id',
            'doors.name as door_name',
            'floors.name as floor_name',
            knex.raw('COUNT(*) as access_count'),
            knex.raw('SUM(CASE WHEN new_status = "open" THEN 1 ELSE 0 END) as open_events'),
            knex.raw('SUM(CASE WHEN new_status = "closed" THEN 1 ELSE 0 END) as close_events'),
            knex.raw('COUNT(DISTINCT changed_by) as unique_users'),
            knex.raw(`MIN(${HISTORY_TABLE}.created_at) as first_access`),
            knex.raw(`MAX(${HISTORY_TABLE}.created_at) as last_access`)
        )
        .orderBy('access_count', 'desc');

    // Apply date filters
    doorComparisonQuery = applyDateFilters(doorComparisonQuery, HISTORY_TABLE, start_date, end_date);

    // Get door comparison data
    const doorComparisonData = await doorComparisonQuery;

    // Prepare report data
    const reportData = {
        report_type: 'door_comparison',
        generated_at: new Date().toISOString(),
        period: {
            start_date: start_date || 'All time',
            end_date: end_date || 'All time'
        },
        door_comparison: doorComparisonData
    };

    // Return CSV if requested
    if (format === 'csv') {
        return jsonToCsv(doorComparisonData);
    }

    return reportData;
};

module.exports = {
    updateLockStatus,
    getLockHistory,
    getLockStatus,
    generateSummaryReport,
    generateFrequencyReport,
    generateUserActivityReport,
    generateTimeAnalysisReport,
    generateDoorComparisonReport
};
