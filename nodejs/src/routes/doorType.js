/**
 * Door Type Routes
 * Defines API endpoints for door types
 */
const express = require('express');
const router = express.Router();
const doorTypeController = require('@controllers/doorType.controller');
const {verifyToken} = require('@middleware/auth.middleware');
const {
    validateDoorTypeId,
    validateCreateDoorType,
    validateUpdateDoorType
} = require('@middleware/validators/doorType.validator');

/**
 * @route GET /door-types
 * @desc Get all door types
 * @access Private
 */
router.get('/', verifyToken, doorTypeController.getAllDoorTypes);

/**
 * @route GET /door-types/:id
 * @desc Get door type by ID
 * @access Private
 */
router.get('/:id', verifyToken, validateDoorTypeId, doorTypeController.getDoorTypeById);

/**
 * @route POST /door-types
 * @desc Create a new door type
 * @access Private
 */
router.post('/', verifyToken, validateCreateDoorType, doorTypeController.createDoorType);

/**
 * @route PUT /door-types/:id
 * @desc Update an existing door type
 * @access Private
 */
router.put('/:id', verifyToken, validateUpdateDoorType, doorTypeController.updateDoorType);

/**
 * @route DELETE /door-types/:id
 * @desc Delete a door type
 * @access Private
 */
router.delete('/:id', verifyToken, validateDoorTypeId, doorTypeController.deleteDoorType);

module.exports = router;