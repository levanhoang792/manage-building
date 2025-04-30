const express = require('express');
const router = express.Router();

// Use info routes
router.use('/info', require('@/src/routes/info'));

// Authentication routes
router.use('/auth', require('@/src/routes/auth'));

// You can add more routes or import from other files
// Example: router.use('/users', require('@/src/routes/users'));

module.exports = router;