require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'building_management',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
    thingsboard: {
        baseUrl: process.env.THINGSBOARD_BASE_URL || 'https://thingsboard.cloud',
        username: process.env.THINGSBOARD_USERNAME,
        password: process.env.THINGSBOARD_PASSWORD,
    },
}; 