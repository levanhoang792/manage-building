const express = require('express');
const router = express.Router();
const dashboardController = require('@/src/controllers/dashboard.controller');

// Get all dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// Get door status by floor for a specific building
router.get('/buildings/:buildingId/floor-stats', dashboardController.getDoorStatusByFloor);

module.exports = router; 