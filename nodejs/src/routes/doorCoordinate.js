const express = require('express');
const router = express.Router({ mergeParams: true });
const doorCoordinateController = require('../controllers/doorCoordinate.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route GET /api/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates
 * @desc Get all coordinates for a door
 * @access Private
 */
router.get('/', authMiddleware.verifyToken, doorCoordinateController.getDoorCoordinates);

/**
 * @route GET /api/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id
 * @desc Get door coordinate by ID
 * @access Private
 */
router.get('/:id', authMiddleware.verifyToken, doorCoordinateController.getDoorCoordinateById);

/**
 * @route POST /api/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates
 * @desc Create new door coordinate
 * @access Private
 */
router.post('/', authMiddleware.verifyToken, doorCoordinateController.createDoorCoordinate);

/**
 * @route PUT /api/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id
 * @desc Update door coordinate
 * @access Private
 */
router.put('/:id', authMiddleware.verifyToken, doorCoordinateController.updateDoorCoordinate);

/**
 * @route DELETE /api/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id
 * @desc Delete door coordinate
 * @access Private
 */
router.delete('/:id', authMiddleware.verifyToken, doorCoordinateController.deleteDoorCoordinate);

module.exports = router;