/**
 * Door Type Controller
 * Handles HTTP requests for door types
 */
const doorTypeService = require('@src/services/doorTypeService');
const { success, error } = require('@utils/responseHandler');
const { CREATED, OK, BAD_REQUEST, NOT_FOUND, CONFLICT } = require('@utils/responseCodes');

/**
 * Get all door types
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllDoorTypes = async (req, res) => {
    try {
        const doorTypes = await doorTypeService.getAllDoorTypes();
        return success(res, 'Door types retrieved successfully', OK, { doorTypes });
    } catch (error) {
        console.error('Error retrieving door types:', error);
        return error(res, 'Failed to retrieve door types', BAD_REQUEST);
    }
};

/**
 * Get door type by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const doorType = await doorTypeService.getDoorTypeById(id);
        
        if (!doorType) {
            return error(res, 'Door type not found', NOT_FOUND);
        }
        
        return success(res, 'Door type retrieved successfully', OK, { doorType });
    } catch (err) {
        console.error('Error retrieving door type:', err);
        return error(res, 'Failed to retrieve door type', BAD_REQUEST);
    }
};

/**
 * Create a new door type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDoorType = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return error(res, 'Door type name is required', BAD_REQUEST);
        }
        
        // Check if door type with the same name already exists
        const doorTypeExists = await doorTypeService.doorTypeNameExists(name);
        if (doorTypeExists) {
            return error(res, 'Door type with this name already exists', CONFLICT);
        }
        
        const doorTypeData = {
            name,
            description: description || null
        };
        
        const newDoorType = await doorTypeService.createDoorType(doorTypeData);
        
        return success(res, 'Door type created successfully', CREATED, { doorType: newDoorType });
    } catch (err) {
        console.error('Error creating door type:', err);
        return error(res, 'Failed to create door type', BAD_REQUEST);
    }
};

/**
 * Update an existing door type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDoorType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        // Check if door type exists
        const doorType = await doorTypeService.getDoorTypeById(id);
        if (!doorType) {
            return error(res, 'Door type not found', NOT_FOUND);
        }
        
        if (name) {
            // Check if another door type with the same name already exists
            const doorTypeExists = await doorTypeService.doorTypeNameExists(name, id);
            if (doorTypeExists) {
                return error(res, 'Another door type with this name already exists', CONFLICT);
            }
        }
        
        const doorTypeData = {};
        if (name) doorTypeData.name = name;
        if (description !== undefined) doorTypeData.description = description;
        
        const updatedDoorType = await doorTypeService.updateDoorType(id, doorTypeData);
        
        return success(res, 'Door type updated successfully', OK, { doorType: updatedDoorType });
    } catch (err) {
        console.error('Error updating door type:', err);
        return error(res, 'Failed to update door type', BAD_REQUEST);
    }
};

/**
 * Delete a door type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteDoorType = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if door type exists
        const doorType = await doorTypeService.getDoorTypeById(id);
        if (!doorType) {
            return error(res, 'Door type not found', NOT_FOUND);
        }
        
        try {
            await doorTypeService.deleteDoorType(id);
            return success(res, 'Door type deleted successfully', OK);
        } catch (err) {
            if (err.message.includes('in use')) {
                return error(res, 'Cannot delete door type because it is in use by one or more doors', CONFLICT);
            }
            throw err;
        }
    } catch (err) {
        console.error('Error deleting door type:', err);
        return error(res, 'Failed to delete door type', BAD_REQUEST);
    }
};

module.exports = {
    getAllDoorTypes,
    getDoorTypeById,
    createDoorType,
    updateDoorType,
    deleteDoorType
};