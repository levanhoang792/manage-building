const express = require('express');
const router = express.Router({mergeParams: true});
const doorLockController = require('../controllers/doorLock.controller');
const authMiddleware = require('../middleware/auth.middleware');
const permissionMiddleware = require('../middleware/permission.middleware');

/**
 * @route PUT /api/buildings/:buildingId/floors/:floorId/doors/:id/lock
 * @desc Update door lock status
 * @access Private
 */
router.put('/', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.lock.manage'),
    doorLockController.updateLockStatus
);

/**
 * @route GET /api/buildings/:buildingId/floors/:floorId/doors/:id/lock-history
 * @desc Get door lock history
 * @access Private
 */
router.get('/history', 
    authMiddleware.verifyToken, 
    permissionMiddleware.hasPermission('door.lock.view'),
    doorLockController.getLockHistory
);

module.exports = router;