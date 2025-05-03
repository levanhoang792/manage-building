/**
 * Door Type Routes
 * Defines API endpoints for door types
 */
const express = require('express');
const router = express.Router();
const doorTypeController = require('@controllers/doorType.controller');
const {verifyToken} = require('@middleware/auth.middleware');
const permissionMiddleware = require('@middleware/permission.middleware');
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
router.get('/', 
    verifyToken, 
    permissionMiddleware.hasPermission('doorType.view'),
    doorTypeController.getAllDoorTypes
);

/**
 * @route GET /door-types/:id
 * @desc Get door type by ID
 * @access Private
 */
router.get('/:id', 
    verifyToken, 
    permissionMiddleware.hasPermission('doorType.view'),
    validateDoorTypeId, 
    doorTypeController.getDoorTypeById
);

/**
 * @route POST /door-types
 * @desc Create a new door type
 * @access Private
 */
router.post('/', 
    verifyToken, 
    permissionMiddleware.hasPermission('doorType.create'),
    validateCreateDoorType, 
    doorTypeController.createDoorType
);

/**
 * @route PUT /door-types/:id
 * @desc Update an existing door type
 * @access Private
 */
router.put('/:id', 
    verifyToken, 
    permissionMiddleware.hasPermission('doorType.edit'),
    validateUpdateDoorType, 
    doorTypeController.updateDoorType
);

/**
 * @route DELETE /door-types/:id
 * @desc Delete a door type
 * @access Private
 */
router.delete('/:id', 
    verifyToken, 
    permissionMiddleware.hasPermission('doorType.delete'),
    validateDoorTypeId, 
    doorTypeController.deleteDoorType
);

module.exports = router;