const doorModel = require('@models/door.model');
const floorModel = require('@models/floor.model');
const buildingModel = require('@models/building.model');
const { success, error } = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

/**
 * Get all doors for a floor with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoors = async (req, res) => {
    try {
        const {buildingId, floorId} = req.params;
        const {page, limit, search, type, status, sortBy, sortOrder} = req.query;

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

        const result = await doorModel.getAllByFloor(floorId, {
            page,
            limit,
            search,
            type,
            status,
            sortBy,
            sortOrder
        });

        return success(res, 'Doors retrieved successfully', responseCodes.SUCCESS, result);
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

        const id = await doorModel.create(doorData);

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

        const updatedDoor = await doorModel.getById(floorId, id);

        return success(res, 'Door status updated successfully', responseCodes.SUCCESS, updatedDoor);
    } catch (err) {
        console.error('Error updating door status:', err);
        return error(res, 'Failed to update door status', responseCodes.SERVER_ERROR);
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
    deleteDoor
};