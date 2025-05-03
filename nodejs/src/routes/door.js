const express = require('express');
const router = express.Router({mergeParams: true});
const doorController = require('../controllers/door.controller');
const authMiddleware = require('../middleware/auth.middleware');
const permissionMiddleware = require('../middleware/permission.middleware');

/**
 * @route GET /api/buildings/:buildingId/floors/:floorId/doors
 * @desc Get all doors for a floor
 * @access Private
 */
router.get('/', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.view'),
    doorController.getDoors
);

/**
 * @route GET /api/buildings/:buildingId/floors/:floorId/doors/:id
 * @desc Get door by ID
 * @access Private
 */
router.get('/:id', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.view'),
    doorController.getDoorById
);

/**
 * @route POST /api/buildings/:buildingId/floors/:floorId/doors
 * @desc Create new door
 * @access Private
 */
router.post('/', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.create'),
    doorController.createDoor
);

/**
 * @route PUT /api/buildings/:buildingId/floors/:floorId/doors/:id
 * @desc Update door
 * @access Private
 */
router.put('/:id', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.edit'),
    doorController.updateDoor
);

/**
 * @route PATCH /api/buildings/:buildingId/floors/:floorId/doors/:id/status
 * @desc Update door status
 * @access Private
 */
router.patch('/:id/status', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.edit'),
    doorController.updateDoorStatus
);

/**
 * @route DELETE /api/buildings/:buildingId/floors/:floorId/doors/:id
 * @desc Delete door
 * @access Private
 */
router.delete('/:id', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.delete'),
    doorController.deleteDoor
);

module.exports = router;