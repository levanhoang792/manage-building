const express = require('express');
const router = express.Router();

// Use info routes
router.use('/info', require('@routes/info'));

// Authentication routes
router.use('/auth', require('@routes/auth'));

// Profile routes
router.use('/profile', require('@routes/profile'));

// Door types routes
router.use('/door-types', require('@routes/doorType'));

// Building management routes
router.use('/buildings', require('@routes/building'));

// Floor routes (nested under buildings)
router.use('/buildings/:buildingId/floors', require('@routes/floor'));

// Door routes (nested under floors)
router.use('/buildings/:buildingId/floors/:floorId/doors', require('@routes/door'));

// Door coordinate routes (nested under doors)
router.use('/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates', require('@routes/doorCoordinate'));

module.exports = router;