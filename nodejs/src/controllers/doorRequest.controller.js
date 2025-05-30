const doorRequestModel = require('@models/doorRequest.model');
const doorModel = require('@models/door.model');
const doorLockModel = require('@models/doorLock.model');
const floorModel = require('@models/floor.model');
const buildingModel = require('@models/building.model');
const {success, error} = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');
const activityLogger = require('@utils/activityLogger');
const socketService = require('@services/socket.service');
const thingsBoardService = require("@services/thingsboard.service");

/**
 * Get door request status for a specific door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorRequestStatus = async (req, res) => {
    try {
        const {buildingId, floorId, doorId} = req.params;

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
        const door = await doorModel.getById(floorId, doorId);

        if (!door) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        // Get latest pending request for this door
        const latestRequest = await doorRequestModel.getLatestPendingByDoorId(doorId);

        return success(res, 'Door request status retrieved successfully', responseCodes.SUCCESS, {
            hasPendingRequest: !!latestRequest,
            request: latestRequest ? {
                id: latestRequest.id,
                requester_name: latestRequest.requester_name,
                created_at: latestRequest.created_at
            } : null,
            door_status: door.lock_status
        });
    } catch (err) {
        console.error('Error getting door request status:', err);
        return error(res, 'Failed to get door request status', responseCodes.SERVER_ERROR);
    }
};

/**
 * Get all door requests
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllRequests = async (req, res) => {
    try {
        const {
            page,
            limit,
            status,
            buildingId,
            floorId,
            doorId,
            search,
            startDate,
            endDate,
            sortBy,
            sortOrder
        } = req.query;

        const result = await doorRequestModel.getAll({
            page,
            limit,
            status,
            buildingId,
            floorId,
            doorId,
            search,
            startDate,
            endDate,
            sortBy,
            sortOrder
        });

        return success(res, 'Door requests retrieved successfully', responseCodes.SUCCESS, result);
    } catch (err) {
        console.error('Error getting door requests:', err);
        return error(res, 'Failed to retrieve door requests', responseCodes.SERVER_ERROR);
    }
};

/**
 * Get door request by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRequestById = async (req, res) => {
    try {
        const {id} = req.params;

        const request = await doorRequestModel.getById(id);

        if (!request) {
            return error(res, 'Door request not found', responseCodes.NOT_FOUND);
        }

        return success(res, 'Door request retrieved successfully', responseCodes.SUCCESS, request);
    } catch (err) {
        console.error('Error getting door request:', err);
        return error(res, 'Failed to retrieve door request', responseCodes.SERVER_ERROR);
    }
};

/**
 * Create new door request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createRequest = async (req, res) => {
    try {
        const {door_id, requester_name, requester_phone, requester_email, purpose} = req.body;

        // Validate required fields
        if (!door_id || !requester_name || !purpose) {
            return error(res, 'Missing required fields: door_id, requester_name, and purpose are required', responseCodes.BAD_REQUEST);
        }

        // Ensure door_id is a number
        const doorId = parseInt(door_id, 10);
        console.log('Creating door request with door_id:', doorId, 'type:', typeof doorId);

        // Check if door exists and is active
        const door = await doorModel.getById(null, doorId);

        if (!door) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        if (door.status !== 'active') {
            return error(res, `Cannot create request. Door is ${door.status}.`, responseCodes.BAD_REQUEST);
        }

        // Create request
        const requestData = {
            door_id: doorId, // Use the parsed doorId
            requester_name,
            requester_phone: requester_phone || null,
            requester_email: requester_email || null,
            purpose,
            status: 'pending'
            // status: 'approved'
        };

        const id = await doorRequestModel.create(requestData);

        // Get created request
        const newRequest = await doorRequestModel.getById(id);

        // Log activity
        const userId = req.user ? req.user.id : null;
        await activityLogger.log({
            user_id: userId,
            action: 'Created door request',
            entity_type: 'door_request',
            entity_id: id,
            details: {
                door_id,
                door_name: door.name,
                requester_name,
                purpose
            },
            ip_address: req.ip
        });

        // console.log("newRequest: ", JSON.stringify(newRequest));
        try {
            await updateRequestStatusFunction(req, newRequest.id, "approved", userId, purpose);
        } catch (e) {
            console.error('Error updating request status:', e);
            const errorData = JSON.parse(e.message);
            return error(res, errorData.message, errorData.code);
        }

        // Emit socket event for real-time notification
        socketService.emitEvent('new-door-request', {
            id,
            door_id: door.id,
            door_name: door.name,
            requester_name,
            created_at: newRequest.created_at
        });

        return success(res, 'Door request created successfully', responseCodes.CREATED, newRequest);
    } catch (err) {
        console.error('Error creating door request:', err);
        return error(res, 'Failed to create door request', responseCodes.SERVER_ERROR);
    }
};

/**
 * Update door request status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateRequestStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {status, reason} = req.body;
        const userId = req.user.id;

        try {
            const updatedRequest = await updateRequestStatusFunction(req, id, status, userId, reason);

            // Emit socket event for real-time notification
            socketService.emitEvent('door-request-status-updated', {
                id,
                door_id: request.door_id,
                status,
                processed_by: userId,
                processed_at: updatedRequest.processed_at
            });

            return success(res, `Door request ${status} successfully`, responseCodes.SUCCESS, updatedRequest);
        } catch (e) {
            const errorData = JSON.parse(e.message);
            return error(res, errorData.message, errorData.code);
        }
    } catch (err) {
        console.error('Error updating door request status:', err);
        return error(res, 'Failed to update door request status', responseCodes.SERVER_ERROR);
    }
};

const updateRequestStatusFunction = async (req, id, status, userId, reason) => {
    // Validate status
    if (!status || !['approved', 'rejected'].includes(status)) {
        throw new Error(JSON.stringify({
            message: 'Invalid status. Must be "approved" or "rejected".',
            code: responseCodes.BAD_REQUEST
        }));
    }

    // Check if request exists
    const request = await doorRequestModel.getById(id);

    if (!request) {
        throw new Error(JSON.stringify({
            message: 'Door request not found',
            code: responseCodes.NOT_FOUND
        }))
    }

    // Check if request is already processed
    if (request.status !== 'pending') {
        throw new Error(JSON.stringify({
            message: `Door request is already ${request.status}`,
            code: responseCodes.BAD_REQUEST
        }));
    }

    // Update request status with reason
    await doorRequestModel.updateStatus(id, status, userId, reason);

    // If approved, open the door
    if (status === 'approved') {
        // Get the door
        const door = await doorModel.getById(null, request.door_id);

        // Only update if door is currently closed
        if (door) {
            const newStatus = door.lock_status === 'closed' ? 'open' : 'closed';

            // Update door lock status
            await doorLockModel.updateLockStatus(
                door.floor_id,
                door.id,
                newStatus,
                userId,
                id,
                `Approved door request from ${request.requester_name}`
            );

            if (door.thingsboard_device_id) {
                try {
                    // Update device attributes
                    await thingsBoardService.updateDeviceAttributes(door.thingsboard_device_id, {
                        lockStatus: newStatus,
                        status: door.status,
                        lastUpdatedById: userId,
                        lastUpdatedBy: req.user?.full_name || request.requester_name,
                        lastUpdateReason: reason || 'Manual update'
                    });

                    // Send telemetry data
                    await thingsBoardService.sendTelemetry(door.thingsboard_access_token, {
                        lockStatus: newStatus,
                        status: door.status,
                        ts: Date.now(),
                        userId,
                        user_full_name: req.user?.full_name || request.requester_name,
                        requestId: req.body.request_id || null,
                        reason: reason || 'Manual update'
                    });
                } catch (thingsboardError) {
                    console.error('Error updating ThingsBoard device:', thingsboardError);
                    // Continue without ThingsBoard update if it fails
                }
            }

            // Log activity for door lock change
            await activityLogger.log({
                user_id: userId,
                action: 'Changed door lock status due to request approval',
                entity_type: 'door',
                entity_id: door.id,
                details: {
                    door_name: door.name,
                    previous_status: door.lock_status,
                    new_status: newStatus,
                    request_id: id
                },
                ip_address: req.ip
            });
        }
    }

    // Log activity for request status change
    await activityLogger.log({
        user_id: userId,
        action: `${status === 'approved' ? 'Approved' : 'Rejected'} door request`,
        entity_type: 'door_request',
        entity_id: id,
        details: {
            requester_name: request.requester_name,
            door_id: request.door_id,
            door_name: request.door_name,
            reason: reason || null
        },
        ip_address: req.ip
    });

    // Get updated request
    return await doorRequestModel.getById(id);
}

/**
 * Get door requests for a specific door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorRequests = async (req, res) => {
    try {
        const {buildingId, floorId, id} = req.params;
        const {page, limit, status, startDate, endDate, sortBy, sortOrder} = req.query;

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

        // Get door requests
        const requests = await doorRequestModel.getByDoorId(id, {
            page,
            limit,
            status,
            startDate,
            endDate,
            sortBy,
            sortOrder
        });

        // Add door info to response
        const result = {
            ...requests,
            door: {
                id: door.id,
                name: door.name
            }
        };

        return success(res, 'Door requests retrieved successfully', responseCodes.SUCCESS, result);
    } catch (err) {
        console.error('Error getting door requests:', err);
        return error(res, 'Failed to retrieve door requests', responseCodes.SERVER_ERROR);
    }
};

module.exports = {
    getAllRequests,
    getRequestById,
    createRequest,
    updateRequestStatus,
    getDoorRequests,
    getDoorRequestStatus
};