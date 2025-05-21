const doorLockModel = require('@models/doorLock.model');
const doorModel = require('@models/door.model');
const floorModel = require('@models/floor.model');
const buildingModel = require('@models/building.model');
const thingsBoardService = require('@services/thingsboard.service');
const { success, error } = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');
const activityLogger = require('@utils/activityLogger');

/**
 * Update door lock status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateLockStatus = async (req, res) => {
    try {
        const { buildingId, floorId, id } = req.params;
        const { lock_status, reason, request_id } = req.body;
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
                    lastUpdatedBy: userId,
                    lastUpdateReason: reason || 'Manual update'
                });

                // Send telemetry data
                await thingsBoardService.sendTelemetry(door.thingsboard_device_id, {
                    lockStatus: lock_status,
                    ts: Date.now(),
                    userId,
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
        const { buildingId, floorId, id } = req.params;
        const { page, limit, startDate, endDate, sortBy, sortOrder } = req.query;

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

module.exports = {
    updateLockStatus,
    getLockHistory
};