/**
 * Door Type Service
 * Handles business logic for door types
 */
const doorTypeModel = require('@src/models/doorType.model');

/**
 * Get all door types
 * @returns {Promise<Array>} Array of door types
 */
const getAllDoorTypes = async () => {
    return await doorTypeModel.getAllDoorTypes();
};

/**
 * Get door type by ID
 * @param {number} id - Door type ID
 * @returns {Promise<Object>} Door type object
 */
const getDoorTypeById = async (id) => {
    return await doorTypeModel.getDoorTypeById(id);
};

/**
 * Create a new door type
 * @param {Object} doorTypeData - Door type data
 * @returns {Promise<Object>} Created door type
 */
const createDoorType = async (doorTypeData) => {
    const [id] = await doorTypeModel.createDoorType(doorTypeData);
    return await getDoorTypeById(id);
};

/**
 * Update an existing door type
 * @param {number} id - Door type ID
 * @param {Object} doorTypeData - Door type data to update
 * @returns {Promise<Object>} Updated door type
 */
const updateDoorType = async (id, doorTypeData) => {
    await doorTypeModel.updateDoorType(id, doorTypeData);
    return await getDoorTypeById(id);
};

/**
 * Delete a door type
 * @param {number} id - Door type ID
 * @returns {Promise<boolean>} True if door type was deleted, false otherwise
 */
const deleteDoorType = async (id) => {
    // Check if door type is in use
    const isInUse = await doorTypeModel.isDoorTypeInUse(id);
    if (isInUse) {
        throw new Error('Door type is in use and cannot be deleted');
    }
    
    const result = await doorTypeModel.deleteDoorType(id);
    return result > 0;
};

/**
 * Check if a door type with the given name already exists
 * @param {string} name - Door type name
 * @param {number} [excludeId] - ID to exclude from the check
 * @returns {Promise<boolean>} True if door type exists, false otherwise
 */
const doorTypeNameExists = async (name, excludeId = null) => {
    const doorTypes = await doorTypeModel.getAllDoorTypes();
    return doorTypes.some(dt => 
        dt.name.toLowerCase() === name.toLowerCase() && 
        (excludeId === null || dt.id !== parseInt(excludeId))
    );
};

module.exports = {
    getAllDoorTypes,
    getDoorTypeById,
    createDoorType,
    updateDoorType,
    deleteDoorType,
    doorTypeNameExists
};