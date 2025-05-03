const buildingModel = require('@models/building.model');
const { success, error } = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');

/**
 * Get all buildings with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBuildings = async (req, res) => {
    try {
        const {page, limit, search, status, sortBy, sortOrder} = req.query;

        const result = await buildingModel.getAll({
            page,
            limit,
            search,
            status,
            sortBy,
            sortOrder
        });

        return success(res, 'Buildings retrieved successfully', responseCodes.SUCCESS, result);
    } catch (err) {
        console.error('Error getting buildings:', err);
        return error(res, 'Failed to retrieve buildings', responseCodes.SERVER_ERROR);
    }
};

/**
 * Get building by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBuildingById = async (req, res) => {
    try {
        const {id} = req.params;

        const building = await buildingModel.getById(id);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        return success(res, 'Building retrieved successfully', responseCodes.SUCCESS, building);
    } catch (err) {
        console.error('Error getting building:', err);
        return error(res, 'Failed to retrieve building', responseCodes.SERVER_ERROR);
    }
};

/**
 * Create new building
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createBuilding = async (req, res) => {
    try {
        const buildingData = req.body;

        // Set default status if not provided
        if (!buildingData.status) {
            buildingData.status = 'active';
        }

        const id = await buildingModel.create(buildingData);

        const newBuilding = await buildingModel.getById(id);

        return success(res, 'Building created successfully', responseCodes.CREATED, newBuilding);
    } catch (err) {
        console.error('Error creating building:', err);
        return error(res, 'Failed to create building', responseCodes.SERVER_ERROR);
    }
};

/**
 * Update building
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateBuilding = async (req, res) => {
    try {
        const {id} = req.params;
        const buildingData = req.body;

        // Check if building exists
        const existingBuilding = await buildingModel.getById(id);

        if (!existingBuilding) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        await buildingModel.update(id, buildingData);

        const updatedBuilding = await buildingModel.getById(id);

        return success(res, 'Building updated successfully', responseCodes.SUCCESS, updatedBuilding);
    } catch (err) {
        console.error('Error updating building:', err);
        return error(res, 'Failed to update building', responseCodes.SERVER_ERROR);
    }
};

/**
 * Update building status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateBuildingStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;

        if (!status || !['active', 'inactive'].includes(status)) {
            return error(res, 'Invalid status. Status must be either "active" or "inactive"', responseCodes.BAD_REQUEST);
        }

        // Check if building exists
        const existingBuilding = await buildingModel.getById(id);

        if (!existingBuilding) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        await buildingModel.updateStatus(id, status);

        const updatedBuilding = await buildingModel.getById(id);

        return success(res, 'Building status updated successfully', responseCodes.SUCCESS, updatedBuilding);
    } catch (err) {
        console.error('Error updating building status:', err);
        return error(res, 'Failed to update building status', responseCodes.SERVER_ERROR);
    }
};

/**
 * Delete building
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteBuilding = async (req, res) => {
    try {
        const {id} = req.params;

        // Check if building exists
        const existingBuilding = await buildingModel.getById(id);

        if (!existingBuilding) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        await buildingModel.remove(id);

        return success(res, 'Building deleted successfully', responseCodes.SUCCESS);
    } catch (err) {
        console.error('Error deleting building:', err);
        return error(res, 'Failed to delete building', responseCodes.SERVER_ERROR);
    }
};

module.exports = {
    getBuildings,
    getBuildingById,
    createBuilding,
    updateBuilding,
    updateBuildingStatus,
    deleteBuilding
};