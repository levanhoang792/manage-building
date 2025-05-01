/**
 * Example file demonstrating @/ imports from root directory
 */

// Import package.json from root directory
const packageInfo = require('@/package.json');

// Import environment variables
const dotenv = require('dotenv');
const path = require('path');

// Load .env file from root directory
dotenv.config({path: path.join(__dirname, '../../.env')});
// Alternative using @/ alias
// dotenv.config({ path: require('path').join(require('@/'), '.env') });

/**
 * Function to get project information
 */
function getProjectInfo() {
    return {
        name: packageInfo.name,
        version: packageInfo.version,
        description: packageInfo.description,
        environment: process.env.NODE_ENV || 'development'
    };
}

/**
 * Function to get absolute path to a file in the project
 * @param {string} relativePath - Path relative to project root
 * @returns {string} Absolute path
 */
function getProjectPath(relativePath) {
    // Using Node.js path module with @/ alias
    return path.join(require('@/'), relativePath);
}

module.exports = {
    getProjectInfo,
    getProjectPath
};