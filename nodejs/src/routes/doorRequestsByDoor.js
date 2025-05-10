const express = require('express');
const router = express.Router({mergeParams: true});
const doorRequestController = require('../controllers/doorRequest.controller');
const authMiddleware = require('../middleware/auth.middleware');
const permissionMiddleware = require('../middleware/permission.middleware');

/**
 * @route GET /api/buildings/:buildingId/floors/:floorId/doors/:id/requests
 * @desc Get door requests for a specific door
 * @access Private
 */
router.get('/', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.request.view'),
    doorRequestController.getDoorRequests
);

module.exports = router;