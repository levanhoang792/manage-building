const doorRequestModel = require('@models/doorRequest.model');
const doorModel = require('@models/door.model');
const doorLockModel = require('@models/doorLock.model');
const floorModel = require('@models/floor.model');
const buildingModel = require('@models/building.model');
const { success, error } = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');
const activityLogger = require('@utils/activityLogger');
const socketService = require('@services/socket.service');

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
        const { id } = req.params;

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
        const { door_id, requester_name, requester_phone, requester_email, purpose } = req.body;

        // Validate required fields
        if (!door_id || !requester_name || !purpose) {
            return error(res, 'Missing required fields: door_id, requester_name, and purpose are required', responseCodes.BAD_REQUEST);
        }

        // Check if door exists and is active
        const door = await doorModel.getById(null, door_id);

        if (!door) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        if (door.status !== 'active') {
            return error(res, `Cannot create request. Door is ${door.status}.`, responseCodes.BAD_REQUEST);
        }

        // Create request
        const requestData = {
            door_id,
            requester_name,
            requester_phone: requester_phone || null,
            requester_email: requester_email || null,
            purpose,
            status: 'pending'
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
        const { id } = req.params;
        const { status, reason } = req.body;
        const userId = req.user.id;

        // Validate status
        if (!status || !['approved', 'rejected'].includes(status)) {
            return error(res, 'Invalid status. Must be "approved" or "rejected".', responseCodes.BAD_REQUEST);
        }

        // Check if request exists
        const request = await doorRequestModel.getById(id);

        if (!request) {
            return error(res, 'Door request not found', responseCodes.NOT_FOUND);
        }

        // Check if request is already processed
        if (request.status !== 'pending') {
            return error(res, `Door request is already ${request.status}`, responseCodes.BAD_REQUEST);
        }

        // Update request status
        await doorRequestModel.updateStatus(id, status, userId);

        // If approved, open the door
        if (status === 'approved') {
            // Get the door
            const door = await doorModel.getById(null, request.door_id);

            // Only update if door is currently closed
            if (door && door.lock_status === 'closed') {
                // Update door lock status
                await doorLockModel.updateLockStatus(
                    door.floor_id, 
                    door.id, 
                    'open', 
                    userId, 
                    id, 
                    `Approved door request from ${request.requester_name}`
                );

                // Log activity for door lock change
                await activityLogger.log({
                    user_id: userId,
                    action: 'Changed door lock status due to request approval',
                    entity_type: 'door',
                    entity_id: door.id,
                    details: {
                        door_name: door.name,
                        previous_status: 'closed',
                        new_status: 'open',
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
        const updatedRequest = await doorRequestModel.getById(id);

        // Emit socket event for real-time notification
        socketService.emitEvent('door-request-status-updated', {
            id,
            door_id: request.door_id,
            status,
            processed_by: userId,
            processed_at: updatedRequest.processed_at
        });

        return success(res, `Door request ${status} successfully`, responseCodes.SUCCESS, updatedRequest);
    } catch (err) {
        console.error('Error updating door request status:', err);
        return error(res, 'Failed to update door request status', responseCodes.SERVER_ERROR);
    }
};

/**
 * Get door requests for a specific door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorRequests = async (req, res) => {
    try {
        const { buildingId, floorId, id } = req.params;
        const { page, limit, status, startDate, endDate, sortBy, sortOrder } = req.query;

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
    getDoorRequests
};