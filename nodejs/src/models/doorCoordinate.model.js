const knex = require('@config/knex');
const TABLE_NAME = 'door_coordinates';

/**
 * Get coordinates for a door
 * @param {number} doorId - Door ID
 * @returns {Promise<Array>}
 */
const getByDoorId = async (doorId) => {
    return knex(TABLE_NAME)
        .select('*')
        .where('door_id', doorId);
};

/**
 * Get coordinate by ID
 * @param {number} doorId - Door ID
 * @param {number} id - Coordinate ID
 * @returns {Promise<Object>}
 */
const getById = async (doorId, id) => {
    return knex(TABLE_NAME)
        .where({
            'door_id': doorId,
            'id': id
        })
        .first();
};

/**
 * Create new door coordinate
 * @param {Object} coordinate - Coordinate data
 * @returns {Promise<number>} - ID of created coordinate
 */
const create = async (coordinate) => {
    const [id] = await knex(TABLE_NAME)
        .insert({
            ...coordinate,
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        });

    return id;
};

/**
 * Update door coordinate
 * @param {number} doorId - Door ID
 * @param {number} id - Coordinate ID
 * @param {Object} coordinate - Coordinate data to update
 * @returns {Promise<number>} - Number of updated rows
 */
const update = async (doorId, id, coordinate) => {
    return knex(TABLE_NAME)
        .where({
            'door_id': doorId,
            'id': id
        })
        .update({
            ...coordinate,
            updated_at: knex.fn.now()
        });
};

/**
 * Delete door coordinate
 * @param {number} doorId - Door ID
 * @param {number} id - Coordinate ID
 * @returns {Promise<number>} - Number of deleted rows
 */
const remove = async (doorId, id) => {
    return knex(TABLE_NAME)
        .where({
            'door_id': doorId,
            'id': id
        })
        .del();
};

module.exports = {
    getByDoorId,
    getById,
    create,
    update,
    remove
};