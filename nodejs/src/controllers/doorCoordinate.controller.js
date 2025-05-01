const doorCoordinateModel = require('../models/doorCoordinate.model');
const doorModel = require('../models/door.model');
const floorModel = require('../models/floor.model');
const buildingModel = require('../models/building.model');
const { success, error } = require('../utils/responseHandler');
const responseCodes = require('../utils/responseCodes');

/**
 * Get coordinates for a door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorCoordinates = async (req, res) => {
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

        const coordinates = await doorCoordinateModel.getByDoorId(doorId);

        return success(res, 'Door coordinates retrieved successfully', responseCodes.SUCCESS, coordinates);
    } catch (err) {
        console.error('Error getting door coordinates:', err);
        return error(res, 'Failed to retrieve door coordinates', responseCodes.SERVER_ERROR);
    }
};

/**
 * Get door coordinate by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorCoordinateById = async (req, res) => {
    try {
        const {buildingId, floorId, doorId, id} = req.params;

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

        const coordinate = await doorCoordinateModel.getById(doorId, id);

        if (!coordinate) {
            return error(res, 'Door coordinate not found', responseCodes.NOT_FOUND);
        }

        return success(res, 'Door coordinate retrieved successfully', responseCodes.SUCCESS, coordinate);
    } catch (err) {
        console.error('Error getting door coordinate:', err);
        return error(res, 'Failed to retrieve door coordinate', responseCodes.SERVER_ERROR);
    }
};

/**
 * Create new door coordinate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDoorCoordinate = async (req, res) => {
    try {
        const {buildingId, floorId, doorId} = req.params;
        const coordinateData = req.body;

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

        // Validate required fields
        if (!coordinateData.x_coordinate || !coordinateData.y_coordinate) {
            return error(res, 'x_coordinate and y_coordinate are required', responseCodes.BAD_REQUEST);
        }

        // Set door ID
        coordinateData.door_id = doorId;

        const id = await doorCoordinateModel.create(coordinateData);

        const newCoordinate = await doorCoordinateModel.getById(doorId, id);

        return success(res, 'Door coordinate created successfully', responseCodes.CREATED, newCoordinate);
    } catch (err) {
        console.error('Error creating door coordinate:', err);
        return error(res, 'Failed to create door coordinate', responseCodes.SERVER_ERROR);
    }
};

/**
 * Update door coordinate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDoorCoordinate = async (req, res) => {
    try {
        const {buildingId, floorId, doorId, id} = req.params;
        const coordinateData = req.body;

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

        // Check if coordinate exists
        const existingCoordinate = await doorCoordinateModel.getById(doorId, id);

        if (!existingCoordinate) {
            return error(res, 'Door coordinate not found', responseCodes.NOT_FOUND);
        }

        // Ensure door_id cannot be changed
        delete coordinateData.door_id;

        await doorCoordinateModel.update(doorId, id, coordinateData);

        const updatedCoordinate = await doorCoordinateModel.getById(doorId, id);

        return success(res, 'Door coordinate updated successfully', responseCodes.SUCCESS, updatedCoordinate);
    } catch (err) {
        console.error('Error updating door coordinate:', err);
        return error(res, 'Failed to update door coordinate', responseCodes.SERVER_ERROR);
    }
};

/**
 * Delete door coordinate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteDoorCoordinate = async (req, res) => {
    try {
        const {buildingId, floorId, doorId, id} = req.params;

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

        // Check if coordinate exists
        const existingCoordinate = await doorCoordinateModel.getById(doorId, id);

        if (!existingCoordinate) {
            return error(res, 'Door coordinate not found', responseCodes.NOT_FOUND);
        }

        await doorCoordinateModel.remove(doorId, id);

        return success(res, 'Door coordinate deleted successfully', responseCodes.SUCCESS);
    } catch (err) {
        console.error('Error deleting door coordinate:', err);
        return error(res, 'Failed to delete door coordinate', responseCodes.SERVER_ERROR);
    }
};

module.exports = {
    getDoorCoordinates,
    getDoorCoordinateById,
    createDoorCoordinate,
    updateDoorCoordinate,
    deleteDoorCoordinate
};