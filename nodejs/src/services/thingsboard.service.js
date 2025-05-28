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
            // Add active state to device
            const device = {
                ...deviceData,
                additionalInfo: {
                    ...deviceData.additionalInfo,
                    active: true
                }
            };
            const response = await axios.post(`${this.baseUrl}/api/device`, device, {headers});
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
            const response = await axios.get(`${this.baseUrl}/api/device/${deviceId}/credentials`, {headers});
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
            await axios.delete(`${this.baseUrl}/api/device/${deviceId}`, {headers});
        } catch (error) {
            console.error('Error deleting device:', error);
            throw error;
        }
    }

    /**
     * Update device activity state
     * @param {string} deviceId - Device ID
     * @param {boolean} active - Whether device is active
     */
    async updateDeviceActivity(deviceId, active) {
        try {
            const headers = await this.getAuthHeader();
            await axios.post(
                `${this.baseUrl}/api/plugins/telemetry/DEVICE/${deviceId}/SERVER_SCOPE`,
                {active},
                {headers}
            );
        } catch (error) {
            console.error('Error updating device activity:', error);
            throw error;
        }
    }

    /**
     * Update device attributes
     * @param {string} deviceId - Device ID
     * @param {Object} attributes - Device attributes
     */
    async updateDeviceAttributes(deviceId, attributes) {
        console.log('Updating device attributes:', deviceId, attributes);

        try {
            const headers = await this.getAuthHeader();
            // Convert keys to lowercase
            const formattedAttributes = {
                ...attributes,
                lock_status: attributes.lockStatus,
                status: attributes.status,
                last_updated_by: attributes.lastUpdatedBy,
                last_update_reason: attributes.lastUpdateReason
            };

            // Update shared attributes
            await axios.post(
                `${this.baseUrl}/api/plugins/telemetry/DEVICE/${deviceId}/SHARED_SCOPE`,
                formattedAttributes,
                {headers}
            );

            // Update device activity based on status
            await this.updateDeviceActivity(deviceId, attributes.status === 'active');

        } catch (error) {
            console.error('Error updating device attributes:', error);
            throw error;
        }
    }

    /**
     * Send telemetry data to device
     * @param {string} deviceId - Device ID
     * @param {Object} telemetry - Telemetry data
     */
    async sendTelemetry(deviceId, telemetry) {
        console.log('Sending telemetry data:', deviceId, telemetry);

        try {
            const headers = await this.getAuthHeader();
            // Format telemetry data according to ThingsBoard API requirements
            const formattedData = {
                ...telemetry,
                lock_status: telemetry.lockStatus,
                user_id: telemetry.userId,
                request_id: telemetry.requestId,
                reason: telemetry.reason,
                timestamp: telemetry.ts
            };

            await axios.post(
                `${this.baseUrl}/api/v1/${deviceId}/telemetry`,
                formattedData,
                {headers}
            );
        } catch (error) {
            console.error('Error sending telemetry data:', error);
            throw error;
        }
    }
}

module.exports = new ThingsBoardService(); 