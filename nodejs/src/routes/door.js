const express = require('express');
const router = express.Router({mergeParams: true});
const doorController = require('../controllers/door.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route GET /api/buildings/:buildingId/floors/:floorId/doors
 * @desc Get all doors for a floor
 * @access Private
 */
router.get('/', authMiddleware.verifyToken, doorController.getDoors);

/**
 * @route GET /api/buildings/:buildingId/floors/:floorId/doors/:id
 * @desc Get door by ID
 * @access Private
 */
router.get('/:id', authMiddleware.verifyToken, doorController.getDoorById);

/**
 * @route POST /api/buildings/:buildingId/floors/:floorId/doors
 * @desc Create new door
 * @access Private
 */
router.post('/', authMiddleware.verifyToken, doorController.createDoor);

/**
 * @route PUT /api/buildings/:buildingId/floors/:floorId/doors/:id
 * @desc Update door
 * @access Private
 */
router.put('/:id', authMiddleware.verifyToken, doorController.updateDoor);

/**
 * @route PATCH /api/buildings/:buildingId/floors/:floorId/doors/:id/status
 * @desc Update door status
 * @access Private
 */
router.patch('/:id/status', authMiddleware.verifyToken, doorController.updateDoorStatus);

/**
 * @route DELETE /api/buildings/:buildingId/floors/:floorId/doors/:id
 * @desc Delete door
 * @access Private
 */
router.delete('/:id', authMiddleware.verifyToken, doorController.deleteDoor);

module.exports = router;