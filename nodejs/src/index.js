const express = require('express');
const cors = require('cors');
require('dotenv').config();
const logger = require('@/src/middleware/logger');
const appConfig = require('@/src/config/app');

const app = express();
const PORT = appConfig.port;

// Middleware
app.use(cors(appConfig.corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js server!' });
});

// API routes
app.use('/api', require('@/src/routes'));

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});