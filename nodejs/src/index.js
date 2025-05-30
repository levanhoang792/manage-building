const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
require('dotenv').config();
const logger = require('@/src/middleware/logger');
const appConfig = require('@/src/config/app');
const socketService = require('@/src/services/socket.service');

const app = express();
const PORT = appConfig.port;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
socketService.initialize(server);

// Middleware
app.use(cors(appConfig.corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req, res) => {
    res.json({message: 'Welcome to the Node.js server!'});
});

// API routes
app.use('/api', require('@/src/routes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});