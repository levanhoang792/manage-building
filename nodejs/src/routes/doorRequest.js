const express = require('express');
const router = express.Router();
const doorRequestController = require('../controllers/doorRequest.controller');
const authMiddleware = require('../middleware/auth.middleware');
const permissionMiddleware = require('../middleware/permission.middleware');

/**
 * @route GET /api/door-requests
 * @desc Get all door requests
 * @access Private
 */
router.get('/', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.request.view'),
    doorRequestController.getAllRequests
);

/**
 * @route GET /api/door-requests/:id
 * @desc Get door request by ID
 * @access Private
 */
router.get('/:id', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.request.view'),
    doorRequestController.getRequestById
);

/**
 * @route POST /api/door-requests
 * @desc Create new door request
 * @access Public (for guests) or Private (for authenticated users)
 */
router.post('/', 
    authMiddleware.optionalVerifyToken,
    doorRequestController.createRequest
);

/**
 * @route PUT /api/door-requests/:id/status
 * @desc Update door request status
 * @access Private
 */
router.put('/:id/status', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.request.approve'),
    doorRequestController.updateRequestStatus
);

/**
 * @route GET /api/door-requests/door/:buildingId/:floorId/:doorId/status
 * @desc Get door request status for a specific door
 * @access Public
 */
router.get('/door/:buildingId/:floorId/:doorId/status',
    doorRequestController.getDoorRequestStatus
);

module.exports = router;