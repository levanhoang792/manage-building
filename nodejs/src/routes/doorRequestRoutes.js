const express = require('express');
const router = express.Router();
const doorRequestController = require('../controllers/doorRequestController');

// Check door request status
router.get('/status/:buildingId/:floorId/:doorId', doorRequestController.checkDoorRequestStatus);

module.exports = router; 