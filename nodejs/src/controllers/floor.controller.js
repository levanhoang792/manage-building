const floorModel = require('@models/floor.model');
const buildingModel = require('@models/building.model');
const { success, error } = require('@utils/responseHandler');
const responseCodes = require('@utils/responseCodes');
const path = require('path');
const fs = require('fs');

/**
 * Get all floors for a building with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFloors = async (req, res) => {
    try {
        const {buildingId} = req.params;
        const {page, limit, search, status, sortBy, sortOrder} = req.query;

        // Check if building exists
        const building = await buildingModel.getById(buildingId);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        const result = await floorModel.getAllByBuilding(buildingId, {
            page,
            limit,
            search,
            status,
            sortBy,
            sortOrder
        });

        return success(res, 'Floors retrieved successfully', responseCodes.SUCCESS, result);
    } catch (err) {
        console.error('Error getting floors:', err);
        return error(res, 'Failed to retrieve floors', responseCodes.SERVER_ERROR);
    }
};

/**
 * Get floor by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFloorById = async (req, res) => {
    try {
        const {buildingId, id} = req.params;

        // Check if building exists
        const building = await buildingModel.getById(buildingId);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        const floor = await floorModel.getById(buildingId, id);

        if (!floor) {
            return error(res, 'Floor not found', responseCodes.NOT_FOUND);
        }

        return success(res, 'Floor retrieved successfully', responseCodes.SUCCESS, floor);
    } catch (err) {
        console.error('Error getting floor:', err);
        return error(res, 'Failed to retrieve floor', responseCodes.SERVER_ERROR);
    }
};

/**
 * Create new floor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createFloor = async (req, res) => {
    try {
        const {buildingId} = req.params;
        const floorData = req.body;

        // Check if building exists
        const building = await buildingModel.getById(buildingId);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        // Check for duplicate floor name or number
        const duplicate = await floorModel.checkDuplicate(
            buildingId, 
            floorData.name, 
            floorData.floor_number
        );

        if (duplicate) {
            let message = 'Duplicate floor detected.';
            if (duplicate.name === floorData.name) {
                message = `A floor with the name "${floorData.name}" already exists in this building.`;
            } else if (duplicate.floor_number === floorData.floor_number) {
                message = `A floor with the number "${floorData.floor_number}" already exists in this building.`;
            }
            return error(res, message, responseCodes.BAD_REQUEST);
        }

        // Set building ID and default status if not provided
        floorData.building_id = buildingId;
        if (!floorData.status) {
            floorData.status = 'active';
        }

        const id = await floorModel.create(floorData);

        const newFloor = await floorModel.getById(buildingId, id);

        return success(res, 'Floor created successfully', responseCodes.CREATED, newFloor);
    } catch (err) {
        console.error('Error creating floor:', err);
        return error(res, 'Failed to create floor', responseCodes.SERVER_ERROR);
    }
};

/**
 * Update floor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateFloor = async (req, res) => {
    try {
        const {buildingId, id} = req.params;
        const floorData = req.body;

        // Check if building exists
        const building = await buildingModel.getById(buildingId);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        // Check if floor exists
        const existingFloor = await floorModel.getById(buildingId, id);

        if (!existingFloor) {
            return error(res, 'Floor not found', responseCodes.NOT_FOUND);
        }

        // Check for duplicate floor name or number (excluding current floor)
        if (floorData.name || floorData.floor_number) {
            const name = floorData.name || existingFloor.name;
            const floorNumber = floorData.floor_number || existingFloor.floor_number;
            
            const duplicate = await floorModel.checkDuplicate(
                buildingId, 
                name, 
                floorNumber, 
                id
            );

            if (duplicate) {
                let message = 'Duplicate floor detected.';
                if (duplicate.name === name) {
                    message = `A floor with the name "${name}" already exists in this building.`;
                } else if (duplicate.floor_number === floorNumber) {
                    message = `A floor with the number "${floorNumber}" already exists in this building.`;
                }
                return error(res, message, responseCodes.BAD_REQUEST);
            }
        }

        // Ensure building_id cannot be changed
        delete floorData.building_id;

        await floorModel.update(buildingId, id, floorData);

        const updatedFloor = await floorModel.getById(buildingId, id);

        return success(res, 'Floor updated successfully', responseCodes.SUCCESS, updatedFloor);
    } catch (err) {
        console.error('Error updating floor:', err);
        return error(res, 'Failed to update floor', responseCodes.SERVER_ERROR);
    }
};

/**
 * Update floor status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateFloorStatus = async (req, res) => {
    try {
        const {buildingId, id} = req.params;
        const {status} = req.body;

        if (!status || !['active', 'inactive'].includes(status)) {
            return error(res, 'Invalid status. Status must be either "active" or "inactive"', responseCodes.BAD_REQUEST);
        }

        // Check if building exists
        const building = await buildingModel.getById(buildingId);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        // Check if floor exists
        const existingFloor = await floorModel.getById(buildingId, id);

        if (!existingFloor) {
            return error(res, 'Floor not found', responseCodes.NOT_FOUND);
        }

        await floorModel.updateStatus(buildingId, id, status);

        const updatedFloor = await floorModel.getById(buildingId, id);

        return success(res, 'Floor status updated successfully', responseCodes.SUCCESS, updatedFloor);
    } catch (err) {
        console.error('Error updating floor status:', err);
        return error(res, 'Failed to update floor status', responseCodes.SERVER_ERROR);
    }
};

/**
 * Upload floor plan image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadFloorPlan = async (req, res) => {
    try {
        const {buildingId, id} = req.params;

        if (!req.file) {
            return error(res, 'No file uploaded', responseCodes.BAD_REQUEST);
        }

        // Check if building exists
        const building = await buildingModel.getById(buildingId);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        // Check if floor exists
        const existingFloor = await floorModel.getById(buildingId, id);

        if (!existingFloor) {
            return error(res, 'Floor not found', responseCodes.NOT_FOUND);
        }

        // If there's an existing floor plan, delete it
        if (existingFloor.floor_plan_image) {
            const oldImagePath = path.join(__dirname, '../../', existingFloor.floor_plan_image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Save the new floor plan path
        const imagePath = `/uploads/floor-plans/${req.file.filename}`;
        await floorModel.updateFloorPlan(buildingId, id, imagePath);

        const updatedFloor = await floorModel.getById(buildingId, id);

        return success(res, 'Floor plan uploaded successfully', responseCodes.SUCCESS, updatedFloor);
    } catch (err) {
        console.error('Error uploading floor plan:', err);
        return error(res, 'Failed to upload floor plan', responseCodes.SERVER_ERROR);
    }
};

/**
 * Delete floor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteFloor = async (req, res) => {
    try {
        const {buildingId, id} = req.params;

        // Check if building exists
        const building = await buildingModel.getById(buildingId);

        if (!building) {
            return error(res, 'Building not found', responseCodes.NOT_FOUND);
        }

        // Check if floor exists
        const existingFloor = await floorModel.getById(buildingId, id);

        if (!existingFloor) {
            return error(res, 'Floor not found', responseCodes.NOT_FOUND);
        }

        // If there's a floor plan image, delete it
        if (existingFloor.floor_plan_image) {
            const imagePath = path.join(__dirname, '../../', existingFloor.floor_plan_image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await floorModel.remove(buildingId, id);

        return success(res, 'Floor deleted successfully', responseCodes.SUCCESS);
    } catch (err) {
        console.error('Error deleting floor:', err);
        return error(res, 'Failed to delete floor', responseCodes.SERVER_ERROR);
    }
};

module.exports = {
    getFloors,
    getFloorById,
    createFloor,
    updateFloor,
    updateFloorStatus,
    uploadFloorPlan,
    deleteFloor
};