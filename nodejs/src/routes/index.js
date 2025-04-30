const express = require('express');
const router = express.Router();
const helloController = require('@/src/controllers/helloController');

// Sample route using controller
router.get('/hello', helloController.getHello);

// Use info routes
router.use('/info', require('@/src/routes/info'));

// You can add more routes or import from other files
// Example: router.use('/users', require('@/src/routes/users'));

module.exports = router;