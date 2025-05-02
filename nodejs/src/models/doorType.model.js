/**
 * Door Type Model
 * Handles database operations for door types
 */
const knex = require('@config/knex');
const TABLE_NAME = 'door_types';

/**
 * Get all door types
 * @returns {Promise<Array>} Array of door types
 */
const getAllDoorTypes = async () => {
    return await knex(TABLE_NAME).select('*');
};

/**
 * Get door type by ID
 * @param {number} id - Door type ID
 * @returns {Promise<Object>} Door type object
 */
const getDoorTypeById = async (id) => {
    return await knex(TABLE_NAME).where({ id }).first();
};

/**
 * Create a new door type
 * @param {Object} doorTypeData - Door type data
 * @param {string} doorTypeData.name - Door type name
 * @param {string} [doorTypeData.description] - Door type description
 * @returns {Promise<number[]>} Array containing the ID of the created door type
 */
const createDoorType = async (doorTypeData) => {
    return await knex(TABLE_NAME).insert(doorTypeData);
};

/**
 * Update an existing door type
 * @param {number} id - Door type ID
 * @param {Object} doorTypeData - Door type data to update
 * @returns {Promise<number>} Number of affected rows
 */
const updateDoorType = async (id, doorTypeData) => {
    return await knex(TABLE_NAME).where({ id }).update(doorTypeData);
};

/**
 * Delete a door type
 * @param {number} id - Door type ID
 * @returns {Promise<number>} Number of affected rows
 */
const deleteDoorType = async (id) => {
    return await knex(TABLE_NAME).where({ id }).del();
};

/**
 * Check if a door type is in use
 * @param {number} id - Door type ID
 * @returns {Promise<boolean>} True if door type is in use, false otherwise
 */
const isDoorTypeInUse = async (id) => {
    const count = await knex('doors').where({ door_type_id: id }).count('id as count').first();
    return count.count > 0;
};

module.exports = {
    getAllDoorTypes,
    getDoorTypeById,
    createDoorType,
    updateDoorType,
    deleteDoorType,
    isDoorTypeInUse
};