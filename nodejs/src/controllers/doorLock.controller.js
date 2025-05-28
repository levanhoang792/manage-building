const doorLockModel = require('@models/doorLock.model');
const doorModel = require('@models/door.model');
const floorModel = require('@models/floor.model');
const buildingModel = require('@models/building.model');
const thingsBoardService = require('@services/thingsboard.service');
const {success, error} = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');
const activityLogger = require('@utils/activityLogger');

/**
 * Update door lock status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateLockStatus = async (req, res) => {
    try {
        const {buildingId, floorId, id} = req.params;
        const {lock_status, reason, request_id} = req.body;
        const userId = req.user.id;

        // Validate lock status
        if (!lock_status || !['open', 'closed'].includes(lock_status)) {
            return error(res, 'Invalid lock status. Must be "open" or "closed".', responseCodes.BAD_REQUEST);
        }

        // Check if building exists
        const building = await buildingModel.getById(buildingId);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        // Check if floor exists
        const floor = await floorModel.getById(buildingId, floorId);

        if (!floor) {
            return error(res, 'Floor not found', responseCodes.NOT_FOUND);
        }

        // Check if door exists
        const door = await doorModel.getById(floorId, id);

        if (!door) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        // Check if door is active
        if (door.status !== 'active') {
            return error(res, `Cannot change lock status. Door is ${door.status}.`, responseCodes.BAD_REQUEST);
        }

        // Check if lock status is already the requested status
        if (door.lock_status === lock_status) {
            return error(res, `Door is already ${lock_status}`, responseCodes.BAD_REQUEST);
        }

        // Update lock status
        await doorLockModel.updateLockStatus(floorId, id, lock_status, userId, request_id, reason);

        // Update ThingsBoard device if it exists
        if (door.thingsboard_device_id) {
            try {
                // Update device attributes
                await thingsBoardService.updateDeviceAttributes(door.thingsboard_device_id, {
                    lockStatus: lock_status,
                    status: door.status,
                    lastUpdatedById: userId,
                    lastUpdatedBy: req.user.full_name,
                    lastUpdateReason: reason || 'Manual update'
                });

                // Send telemetry data
                console.log(`Sending telemetry for door ${id} with lock status ${lock_status}`);
                await thingsBoardService.sendTelemetry(door.thingsboard_access_token, {
                    lockStatus: lock_status,
                    status: door.status,
                    ts: Date.now(),
                    userId,
                    user_full_name: req.user.full_name,
                    requestId: request_id || null,
                    reason: reason || 'Manual update'
                });
            } catch (thingsboardError) {
                console.error('Error updating ThingsBoard device:', thingsboardError);
                // Continue without ThingsBoard update if it fails
            }
        }

        // Log activity
        await activityLogger.log({
            user_id: userId,
            action: `Changed door lock status from ${door.lock_status} to ${lock_status}`,
            entity_type: 'door',
            entity_id: id,
            details: {
                door_name: door.name,
                previous_status: door.lock_status,
                new_status: lock_status,
                reason: reason || null,
                request_id: request_id || null
            },
            ip_address: req.ip
        });

        // Get updated door
        const updatedDoor = await doorModel.getById(floorId, id);

        return success(res, 'Door lock status updated successfully', responseCodes.SUCCESS, updatedDoor);
    } catch (err) {
        console.error('Error updating door lock status:', err);
        return error(res, 'Failed to update door lock status', responseCodes.SERVER_ERROR);
    }
};

/**
 * Get door lock history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLockHistory = async (req, res) => {
    try {
        const {buildingId, floorId, id} = req.params;
        const {page, limit, startDate, endDate, sortBy, sortOrder} = req.query;

        // Check if building exists
        const building = await buildingModel.getById(buildingId);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        // Check if floor exists
        const floor = await floorModel.getById(buildingId, floorId);

        if (!floor) {
            return error(res, 'Floor not found', responseCodes.NOT_FOUND);
        }

        // Check if door exists
        const door = await doorModel.getById(floorId, id);

        if (!door) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        // Get lock history
        const history = await doorLockModel.getLockHistory(id, {
            page,
            limit,
            startDate,
            endDate,
            sortBy,
            sortOrder
        });

        // Add door info to response
        const result = {
            ...history,
            door: {
                id: door.id,
                name: door.name,
                current_lock_status: door.lock_status
            }
        };

        return success(res, 'Door lock history retrieved successfully', responseCodes.SUCCESS, result);
    } catch (err) {
        console.error('Error getting door lock history:', err);
        return error(res, 'Failed to retrieve door lock history', responseCodes.SERVER_ERROR);
    }
};

/**
 * Get door access reports
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorAccessReports = async (req, res) => {
    try {
        const {buildingId, floorId, id} = req.params;
        const {
            report_type = 'summary',
            start_date,
            end_date,
            group_by = 'day',
            format = 'json'
        } = req.query;

        // Validate report type
        const validReportTypes = ['summary', 'frequency', 'user_activity', 'time_analysis', 'door_comparison'];
        if (!validReportTypes.includes(report_type)) {
            return error(res, `Invalid report type. Must be one of: ${validReportTypes.join(', ')}`, responseCodes.BAD_REQUEST);
        }

        // Validate group by
        const validGroupBy = ['hour', 'day', 'week', 'month', 'year'];
        if (!validGroupBy.includes(group_by)) {
            return error(res, `Invalid group by parameter. Must be one of: ${validGroupBy.join(', ')}`, responseCodes.BAD_REQUEST);
        }

        // Validate format
        const validFormats = ['json', 'csv'];
        if (!validFormats.includes(format)) {
            return error(res, `Invalid format. Must be one of: ${validFormats.join(', ')}`, responseCodes.BAD_REQUEST);
        }

        // Check if building exists
        const building = await buildingModel.getById(buildingId);
        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        // Check if floor exists (only if floor ID is provided)
        let floor = null;
        if (floorId !== 'all') {
            floor = await floorModel.getById(buildingId, floorId);
            if (!floor) {
                return error(res, 'Floor not found', responseCodes.NOT_FOUND);
            }
        }

        // Check if door exists (only if door ID is provided)
        let door = null;
        if (id !== 'all') {
            // Only pass floorId if it's not 'all'
            const actualFloorId = floorId !== 'all' ? floorId : null;
            door = await doorModel.getById(actualFloorId, id);
            if (!door) {
                return error(res, 'Door not found', responseCodes.NOT_FOUND);
            }
        }

        // Generate report based on type
        let reportData;
        const reportOptions = {
            start_date,
            end_date,
            group_by,
            format
        };

        switch (report_type) {
            case 'summary':
                reportData = await doorLockModel.generateSummaryReport(buildingId, floorId, id, reportOptions);
                break;
            case 'frequency':
                reportData = await doorLockModel.generateFrequencyReport(buildingId, floorId, id, reportOptions);
                break;
            case 'user_activity':
                reportData = await doorLockModel.generateUserActivityReport(buildingId, floorId, id, reportOptions);
                break;
            case 'time_analysis':
                reportData = await doorLockModel.generateTimeAnalysisReport(buildingId, floorId, id, reportOptions);
                break;
            case 'door_comparison':
                reportData = await doorLockModel.generateDoorComparisonReport(buildingId, floorId, reportOptions);
                break;
            default:
                reportData = await doorLockModel.generateSummaryReport(buildingId, floorId, id, reportOptions);
        }

        // Handle CSV format
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=door_access_report_${report_type}_${new Date().toISOString().split('T')[0]}.csv`);
            return res.send(reportData);
        }

        // Return JSON response
        return success(res, 'Door access report generated successfully', responseCodes.SUCCESS, reportData);
    } catch (err) {
        console.error('Error generating door access report:', err);
        return error(res, 'Failed to generate door access report', responseCodes.SERVER_ERROR);
    }
};

module.exports = {
    updateLockStatus,
    getLockHistory,
    getDoorAccessReports
};
