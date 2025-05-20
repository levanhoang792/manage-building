const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/building.controller');
const floorController = require('../controllers/floor.controller');
const doorController = require('../controllers/door.controller');
const doorCoordinateController = require('../controllers/doorCoordinate.controller');

/**
 * @route GET /api/guest/buildings
 * @desc Get all buildings for guest
 * @access Public
 */
router.get('/buildings', buildingController.getBuildings);

/**
 * @route GET /api/guest/buildings/:buildingId/floors
 * @desc Get all floors for a building for guest
 * @access Public
 */
router.get('/buildings/:buildingId/floors', floorController.getFloors);

/**
 * @route GET /api/guest/buildings/:buildingId/floors/:floorId/doors
 * @desc Get all doors for a floor for guest
 * @access Public
 */
router.get('/buildings/:buildingId/floors/:floorId/doors', doorController.getDoors);

/**
 * @route GET /api/guest/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates
 * @desc Get all coordinates for a door for guest
 * @access Public
 */
router.get('/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates', doorCoordinateController.getDoorCoordinates);

module.exports = router; 