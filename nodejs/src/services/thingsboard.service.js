const axios = require('axios');
const config = require('@config/config');

class ThingsBoardService {
    constructor() {
        this.baseUrl = config.thingsboard.baseUrl;
        this.username = config.thingsboard.username;
        this.password = config.thingsboard.password;
        this.token = null;
    }

    /**
     * Login to ThingsBoard and get JWT token
     */
    async login() {
        try {
            const response = await axios.post(`${this.baseUrl}/api/auth/login`, {
                username: this.username,
                password: this.password
            });
            this.token = response.data.token;
            return this.token;
        } catch (error) {
            console.error('Error logging in to ThingsBoard:', error);
            throw error;
        }
    }

    /**
     * Get authorization header
     */
    async getAuthHeader() {
        if (!this.token) {
            await this.login();
        }
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Create a new device
     * @param {Object} deviceData - Device data
     * @returns {Promise<Object>} Created device data
     */
    async createDevice(deviceData) {
        try {
            const headers = await this.getAuthHeader();
            const response = await axios.post(`${this.baseUrl}/api/device`, deviceData, { headers });
            return response.data;
        } catch (error) {
            console.error('Error creating device:', error);
            throw error;
        }
    }

    /**
     * Get device credentials
     * @param {string} deviceId - Device ID
     * @returns {Promise<Object>} Device credentials
     */
    async getDeviceCredentials(deviceId) {
        try {
            const headers = await this.getAuthHeader();
            const response = await axios.get(`${this.baseUrl}/api/device/${deviceId}/credentials`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error getting device credentials:', error);
            throw error;
        }
    }

    /**
     * Delete a device
     * @param {string} deviceId - Device ID
     */
    async deleteDevice(deviceId) {
        try {
            const headers = await this.getAuthHeader();
            await axios.delete(`${this.baseUrl}/api/device/${deviceId}`, { headers });
        } catch (error) {
            console.error('Error deleting device:', error);
            throw error;
        }
    }

    /**
     * Update device attributes
     * @param {string} deviceId - Device ID
     * @param {Object} attributes - Device attributes
     */
    async updateDeviceAttributes(deviceId, attributes) {
        try {
            const headers = await this.getAuthHeader();
            await axios.post(`${this.baseUrl}/api/plugins/telemetry/DEVICE/${deviceId}/attributes/SERVER_SCOPE`, 
                attributes, 
                { headers }
            );
        } catch (error) {
            console.error('Error updating device attributes:', error);
            throw error;
        }
    }
}

module.exports = new ThingsBoardService(); 