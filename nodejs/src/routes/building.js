const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/building.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @route GET /api/buildings
 * @desc Get all buildings with pagination and filtering
 * @access Private
 */
router.get('/', authMiddleware.verifyToken, buildingController.getBuildings);

/**
 * @route GET /api/buildings/:id
 * @desc Get building by ID
 * @access Private
 */
router.get('/:id', authMiddleware.verifyToken, buildingController.getBuildingById);

/**
 * @route POST /api/buildings
 * @desc Create new building
 * @access Private
 */
router.post('/', authMiddleware.verifyToken, buildingController.createBuilding);

/**
 * @route PUT /api/buildings/:id
 * @desc Update building
 * @access Private
 */
router.put('/:id', authMiddleware.verifyToken, buildingController.updateBuilding);

/**
 * @route PATCH /api/buildings/:id/status
 * @desc Update building status
 * @access Private
 */
router.patch('/:id/status', authMiddleware.verifyToken, buildingController.updateBuildingStatus);

/**
 * @route DELETE /api/buildings/:id
 * @desc Delete building
 * @access Private
 */
router.delete('/:id', authMiddleware.verifyToken, buildingController.deleteBuilding);

module.exports = router;