const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/building.controller');
const authMiddleware = require('../middleware/auth.middleware');
const permissionMiddleware = require('../middleware/permission.middleware');

/**
 * @route GET /api/buildings
 * @desc Get all buildings with pagination and filtering
 * @access Private
 */
router.get('/', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('building.view'),
    buildingController.getBuildings
);

/**
 * @route GET /api/buildings/:id
 * @desc Get building by ID
 * @access Private
 */
router.get('/:id', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('building.view'),
    buildingController.getBuildingById
);

/**
 * @route POST /api/buildings
 * @desc Create new building
 * @access Private
 */
router.post('/', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('building.create'),
    buildingController.createBuilding
);

/**
 * @route PUT /api/buildings/:id
 * @desc Update building
 * @access Private
 */
router.put('/:id', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('building.edit'),
    buildingController.updateBuilding
);

/**
 * @route PATCH /api/buildings/:id/status
 * @desc Update building status
 * @access Private
 */
router.patch('/:id/status', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('building.edit'),
    buildingController.updateBuildingStatus
);

/**
 * @route DELETE /api/buildings/:id
 * @desc Delete building
 * @access Private
 */
router.delete('/:id', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('building.delete'),
    buildingController.deleteBuilding
);

module.exports = router;