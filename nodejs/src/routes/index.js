const express = require('express');
const router = express.Router();

// Use info routes
router.use('/info', require('@routes/info'));

// Authentication routes
router.use('/auth', require('@routes/auth'));

// Profile routes
router.use('/profile', require('@routes/profile'));

// User management routes
router.use('/users', require('@routes/user'));

// Role management routes
router.use('/roles', require('@routes/role'));

// Permission management routes
router.use('/permissions', require('@routes/permission'));

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

// Door lock routes (nested under doors)
router.use('/buildings/:buildingId/floors/:floorId/doors/:id/lock', require('@routes/doorLock'));

// Door requests by door routes (nested under doors)
router.use('/buildings/:buildingId/floors/:floorId/doors/:id/requests', require('@routes/doorRequestsByDoor'));

// Door requests routes
router.use('/door-requests', require('@routes/doorRequest'));

// Guest routes (public access)
router.use('/guest', require('@routes/guest'));

// Import routes
const dashboardRoutes = require('./dashboard.route');

// Use routes
router.use('/dashboard', dashboardRoutes);

module.exports = router;