const doorModel = require('../models/door.model');
const floorModel = require('../models/floor.model');
const buildingModel = require('../models/building.model');
const thingsBoardService = require('../services/thingsboard.service');
const socketService = require('../services/socket.service');
const { success, error } = require('../utils/responseHandler');
const responseCodes = require('../utils/responseCodes');

/**
 * Get all doors in a floor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoors = async (req, res) => {
    try {
        const {buildingId, floorId} = req.params;
        const {status} = req.query;

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

        const doors = await doorModel.getAllByFloor(floorId, {status});

        return success(res, 'Doors retrieved successfully', responseCodes.SUCCESS, doors);
    } catch (err) {
        console.error('Error getting doors:', err);
        return error(res, 'Failed to retrieve doors', responseCodes.SERVER_ERROR);
    }
};

/**
 * Get door by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorById = async (req, res) => {
    try {
        const {buildingId, floorId, id} = req.params;

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

        const door = await doorModel.getById(floorId, id);

        if (!door) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        return success(res, 'Door retrieved successfully', responseCodes.SUCCESS, door);
    } catch (err) {
        console.error('Error getting door:', err);
        return error(res, 'Failed to retrieve door', responseCodes.SERVER_ERROR);
    }
};

/**
 * Create new door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDoor = async (req, res) => {
    try {
        const {buildingId, floorId} = req.params;
        const doorData = req.body;

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

        // Set floor ID and default status if not provided
        doorData.floor_id = floorId;
        if (!doorData.status) {
            doorData.status = 'active';
        }
        if (!doorData.lock_status) {
            doorData.lock_status = 'closed';
        }

        // Create door in database
        const id = await doorModel.create(doorData);
        
        // Create device in ThingsBoard
        try {
            const deviceData = {
                name: doorData.name,
                type: 'door',
                label: `${building.name} - ${floor.name} - ${doorData.name}`,
                additionalInfo: {
                    description: doorData.description,
                    active: doorData.status === 'active'
                }
            };
            
            // Create device in ThingsBoard
            const device = await thingsBoardService.createDevice(deviceData);
            
            // Get device credentials
            const credentials = await thingsBoardService.getDeviceCredentials(device.id.id);
            
            // Update door with ThingsBoard information
            await doorModel.updateThingsBoardInfo(id, device.id.id, credentials.credentialsId);
            
            // Set initial attributes
            await thingsBoardService.updateDeviceAttributes(device.id.id, {
                buildingId: parseInt(buildingId),
                floorId: parseInt(floorId),
                doorId: id,
                status: doorData.status,
                lockStatus: doorData.lock_status,
                doorType: doorData.door_type_id
            });

            // Send initial telemetry
            await thingsBoardService.sendTelemetry(credentials.credentialsId, {
                lockStatus: doorData.lock_status,
                ts: Date.now(),
                reason: 'Initial setup'
            });

            // Update device activity state
            await thingsBoardService.updateDeviceActivity(device.id.id, doorData.status === 'active');

            // Initialize WebSocket connection for the new device
            await socketService.addDeviceConnection(device.id.id, credentials.credentialsId);
        } catch (thingsboardError) {
            console.error('Error creating ThingsBoard device:', thingsboardError);
            // Continue without ThingsBoard integration if it fails
        }

        const newDoor = await doorModel.getById(floorId, id);

        return success(res, 'Door created successfully', responseCodes.CREATED, newDoor);
    } catch (err) {
        console.error('Error creating door:', err);
        return error(res, 'Failed to create door', responseCodes.SERVER_ERROR);
    }
};

/**
 * Update door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDoor = async (req, res) => {
    try {
        const {buildingId, floorId, id} = req.params;
        const doorData = req.body;

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
        const existingDoor = await doorModel.getById(floorId, id);

        if (!existingDoor) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        // Ensure floor_id cannot be changed
        delete doorData.floor_id;

        await doorModel.update(floorId, id, doorData);

        // Update ThingsBoard device if it exists
        if (existingDoor.thingsboard_device_id) {
            try {
                // Update device attributes
                await thingsBoardService.updateDeviceAttributes(existingDoor.thingsboard_device_id, {
                    status: doorData.status || existingDoor.status,
                    lockStatus: doorData.lock_status || existingDoor.lock_status,
                    doorType: doorData.door_type_id || existingDoor.door_type_id
                });

                // If status changed, update device activity
                if (doorData.status && doorData.status !== existingDoor.status) {
                    await thingsBoardService.updateDeviceActivity(existingDoor.thingsboard_device_id, doorData.status === 'active');
                }

                // If lock_status changed, send telemetry
                if (doorData.lock_status && doorData.lock_status !== existingDoor.lock_status) {
                    await thingsBoardService.sendTelemetry(existingDoor.thingsboard_access_token, {
                        lockStatus: doorData.lock_status,
                        ts: Date.now(),
                        reason: 'Manual update'
                    });
                }
            } catch (thingsboardError) {
                console.error('Error updating ThingsBoard device:', thingsboardError);
                // Continue without ThingsBoard update if it fails
            }
        }

        const updatedDoor = await doorModel.getById(floorId, id);

        return success(res, 'Door updated successfully', responseCodes.SUCCESS, updatedDoor);
    } catch (err) {
        console.error('Error updating door:', err);
        return error(res, 'Failed to update door', responseCodes.SERVER_ERROR);
    }
};

/**
 * Update door status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDoorStatus = async (req, res) => {
    try {
        const {buildingId, floorId, id} = req.params;
        const {status} = req.body;

        if (!status || !['active', 'inactive', 'maintenance'].includes(status)) {
            return error(res, 'Invalid status. Status must be one of: "active", "inactive", "maintenance"', responseCodes.BAD_REQUEST);
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
        const existingDoor = await doorModel.getById(floorId, id);

        if (!existingDoor) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        await doorModel.updateStatus(floorId, id, status);

        // Update ThingsBoard device if it exists
        if (existingDoor.thingsboard_device_id) {
            try {
                // Update device attributes
                await thingsBoardService.updateDeviceAttributes(existingDoor.thingsboard_device_id, {
                    status,
                    lockStatus: existingDoor.lock_status
                });

                // Update device activity state
                await thingsBoardService.updateDeviceActivity(existingDoor.thingsboard_device_id, status === 'active');

                // Send telemetry for status change
                await thingsBoardService.sendTelemetry(existingDoor.thingsboard_access_token, {
                    status,
                    lockStatus: existingDoor.lock_status,
                    ts: Date.now(),
                    reason: `Door status changed to ${status}`
                });
            } catch (thingsboardError) {
                console.error('Error updating ThingsBoard device:', thingsboardError);
                // Continue without ThingsBoard update if it fails
            }
        }

        const updatedDoor = await doorModel.getById(floorId, id);

        return success(res, 'Door status updated successfully', responseCodes.SUCCESS, updatedDoor);
    } catch (err) {
        console.error('Error updating door status:', err);
        return error(res, 'Failed to update door status', responseCodes.SERVER_ERROR);
    }
};

/**
 * Update door lock status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDoorLockStatus = async (req, res) => {
    try {
        const {buildingId, floorId, id} = req.params;
        const {lock_status} = req.body;

        if (!lock_status || !['open', 'closed', 'locked'].includes(lock_status)) {
            return error(res, 'Invalid lock status. Status must be one of: "open", "closed", "locked"', responseCodes.BAD_REQUEST);
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
        const existingDoor = await doorModel.getById(floorId, id);

        if (!existingDoor) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        // Update lock status in database
        await doorModel.updateLockStatus(floorId, id, lock_status);

        // Update ThingsBoard device if it exists
        if (existingDoor.thingsboard_device_id) {
            try {
                // Update device attributes in ThingsBoard
                await thingsBoardService.updateDeviceAttributes(existingDoor.thingsboard_device_id, {
                    lockStatus: lock_status
                });

                // Send telemetry data to ThingsBoard
                await thingsBoardService.sendTelemetry(existingDoor.thingsboard_access_token, {
                    lockStatus: lock_status,
                    ts: Date.now()
                });
            } catch (thingsboardError) {
                console.error('Error updating ThingsBoard device:', thingsboardError);
                // Continue without ThingsBoard update if it fails
            }
        }

        const updatedDoor = await doorModel.getById(floorId, id);

        return success(res, 'Door lock status updated successfully', responseCodes.SUCCESS, updatedDoor);
    } catch (err) {
        console.error('Error updating door lock status:', err);
        return error(res, 'Failed to update door lock status', responseCodes.SERVER_ERROR);
    }
};

/**
 * Delete door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteDoor = async (req, res) => {
    try {
        const {buildingId, floorId, id} = req.params;

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
        const existingDoor = await doorModel.getById(floorId, id);

        if (!existingDoor) {
            return error(res, 'Door not found', responseCodes.NOT_FOUND);
        }

        // Delete ThingsBoard device if it exists
        if (existingDoor.thingsboard_device_id) {
            try {
                // Remove WebSocket connection first
                socketService.removeDeviceConnection(existingDoor.thingsboard_device_id);
                
                // Then delete the device from ThingsBoard
                await thingsBoardService.deleteDevice(existingDoor.thingsboard_device_id);
            } catch (thingsboardError) {
                console.error('Error deleting ThingsBoard device:', thingsboardError);
                // Continue with door deletion even if ThingsBoard deletion fails
            }
        }

        await doorModel.remove(floorId, id);

        return success(res, 'Door deleted successfully', responseCodes.SUCCESS);
    } catch (err) {
        console.error('Error deleting door:', err);
        return error(res, 'Failed to delete door', responseCodes.SERVER_ERROR);
    }
};

module.exports = {
    getDoors,
    getDoorById,
    createDoor,
    updateDoor,
    updateDoorStatus,
    updateDoorLockStatus,
    deleteDoor
};