const express = require('express');
const router = express.Router();

// Use info routes
router.use('/info', require('@/src/routes/info'));

// Authentication routes
router.use('/auth', require('@/src/routes/auth'));

// Profile routes
router.use('/profile', require('@/src/routes/profile'));

// Building management routes
router.use('/buildings', require('@/src/routes/building'));

// Floor routes (nested under buildings)
router.use('/buildings/:buildingId/floors', require('@/src/routes/floor'));

// Door routes (nested under floors)
router.use('/buildings/:buildingId/floors/:floorId/doors', require('@/src/routes/door'));

// Door coordinate routes (nested under doors)
router.use('/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates', require('@/src/routes/doorCoordinate'));

module.exports = router;