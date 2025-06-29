let io;
const WebSocket = require('ws');
const config = require('@config/config');
const thingsBoardService = require('./thingsboard.service');
const doorModel = require('../models/door.model');
const knex = require('@config/knex');

let thingsBoardWsConnections = new Map();
let jwtToken = null;

/**
 * Update door lock status in database
 * @param {string} deviceId - ThingsBoard device ID
 * @param {string} lockStatus - New lock status
 */
const updateDoorLockStatus = async (deviceId, lockStatus) => {
    try {
        await knex('doors')
            .where('thingsboard_device_id', deviceId)
            .update({
                lock_status: lockStatus,
                updated_at: knex.fn.now()
            });
        console.log(`Updated lock status for device ${deviceId} to ${lockStatus}`);
    } catch (error) {
        console.error(`Error updating lock status for device ${deviceId}:`, error);
    }
};

/**
 * Get JWT token for ThingsBoard
 * @returns {Promise<string>} JWT token
 */
const getJwtToken = async () => {
    if (!jwtToken) {
        jwtToken = await thingsBoardService.login();
    }
    return jwtToken;
};

/**
 * Initialize ThingsBoard WebSocket connection for a device
 * @param {string} deviceId - ThingsBoard device ID
 * @param {string} accessToken - Device access token
 */
const initializeThingsBoardWs = async (deviceId, accessToken) => {
    if (!deviceId || !accessToken) {
        console.error('Invalid deviceId or accessToken for ThingsBoard WebSocket');
        return;
    }

    try {
        // Get JWT token
        const token = await getJwtToken();

        // Close existing connection if any
        if (thingsBoardWsConnections.has(deviceId)) {
            thingsBoardWsConnections.get(deviceId).close();
            thingsBoardWsConnections.delete(deviceId);
        }

        // Create WebSocket URL
        const baseUrl = config.thingsboard.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
        const wsUrl = `${baseUrl}/api/ws/plugins/telemetry?token=${token}`;
        
        console.log(`Connecting to ThingsBoard WebSocket for device ${deviceId}`);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log(`Connected to ThingsBoard WebSocket for device: ${deviceId}`);
            
            // Subscribe to device updates
            const subscriptionCommand = {
                tsSubCmds: [
                    {
                        entityType: "DEVICE",
                        entityId: deviceId,
                        scope: "LATEST_TELEMETRY",
                        cmdId: 10
                    }
                ],
                historyCmds: [],
                attrSubCmds: [
                    {
                        entityType: "DEVICE",
                        entityId: deviceId,
                        scope: "CLIENT_SCOPE",
                        cmdId: 11
                    },
                    {
                        entityType: "DEVICE",
                        entityId: deviceId,
                        scope: "SHARED_SCOPE",
                        cmdId: 12
                    }
                ]
            };
            
            ws.send(JSON.stringify(subscriptionCommand));
            console.log(`Sent subscription command for device: ${deviceId}`);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(`Received message from ThingsBoard for device ${deviceId}:`, JSON.stringify(data));
                
                // Process telemetry data and update door status
                processTelemetryData(deviceId, data);
                
                // Add deviceId to the data
                const enrichedData = {
                    ...data,
                    data: {
                        ...data.data,
                        doorId: deviceId
                    }
                };
                
                // Emit the data to connected clients
                if (io) {
                    io.emit('thingsboard-data', enrichedData);
                }
            } catch (error) {
                console.error(`Error processing message for device ${deviceId}:`, error);
            }
        };

        ws.onclose = (event) => {
            console.log(`ThingsBoard WebSocket connection closed for device: ${deviceId}`, event.code, event.reason);
            thingsBoardWsConnections.delete(deviceId);
            
            // Reset JWT token if unauthorized
            if (event.code === 1003 || event.code === 1001) {
                jwtToken = null;
            }

            // Attempt to reconnect after 5 seconds
            setTimeout(async () => {
                try {
                    await initializeThingsBoardWs(deviceId, accessToken);
                } catch (error) {
                    console.error(`Error reconnecting to device ${deviceId}:`, error);
                }
            }, 5000);
        };

        ws.onerror = (error) => {
            console.error(`ThingsBoard WebSocket error for device ${deviceId}:`, error);
        };

        thingsBoardWsConnections.set(deviceId, ws);
    } catch (error) {
        console.error(`Error initializing WebSocket for device ${deviceId}:`, error);
        // Attempt to reconnect after 5 seconds
        setTimeout(async () => {
            try {
                await initializeThingsBoardWs(deviceId, accessToken);
            } catch (retryError) {
                console.error(`Error retrying connection for device ${deviceId}:`, retryError);
            }
        }, 5000);
    }
};

/**
 * Process ThingsBoard telemetry data
 * @param {string} deviceId - ThingsBoard device ID
 * @param {Object} data - Telemetry data
 */
const processTelemetryData = async (deviceId, data) => {
    try {
        // Check if we have lock_status data
        if (data.data && data.data.lock_status) {
            // ThingsBoard sends data as array of [timestamp, value]
            const lockStatusData = data.data.lock_status;
            if (Array.isArray(lockStatusData) && lockStatusData.length > 0) {
                // Get the latest status (last item in array)
                const latestStatus = lockStatusData[lockStatusData.length - 1];
                if (Array.isArray(latestStatus) && latestStatus.length === 2) {
                    const [timestamp, status] = latestStatus;
                    // Update door status in database
                    await updateDoorLockStatus(deviceId, status);
                }
            }
        }
    } catch (error) {
        console.error(`Error processing telemetry data for device ${deviceId}:`, error);
    }
};

/**
 * Initialize Socket.IO and ThingsBoard connections
 * @param {Object} server - HTTP server instance
 */
const initialize = async (server) => {
    io = require('socket.io')(server, {
        cors: {
            origin: process.env.CLIENT_URL || '*',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
        
        // Join rooms for specific entities (buildings, floors, doors)
        socket.on('join-room', (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room: ${room}`);
        });
        
        // Leave rooms
        socket.on('leave-room', (room) => {
            socket.leave(room);
            console.log(`Socket ${socket.id} left room: ${room}`);
        });
        
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    // Initialize ThingsBoard WebSocket connections for all active doors
    try {
        // Get all doors with ThingsBoard integration
        const doors = await doorModel.getAllWithThingsBoard();
        console.log(`Found ${doors.length} doors with ThingsBoard integration`);
        
        // Initialize WebSocket connection for each door
        for (const door of doors) {
            if (door.thingsboard_device_id && door.thingsboard_access_token) {
                await initializeThingsBoardWs(
                    door.thingsboard_device_id,
                    door.thingsboard_access_token
                );
            }
        }
    } catch (error) {
        console.error('Failed to initialize ThingsBoard WebSocket connections:', error);
    }

    return io;
};

/**
 * Add a new ThingsBoard device connection
 * @param {string} deviceId - ThingsBoard device ID
 * @param {string} accessToken - Device access token
 */
const addDeviceConnection = async (deviceId, accessToken) => {
    await initializeThingsBoardWs(deviceId, accessToken);
};

/**
 * Remove a ThingsBoard device connection
 * @param {string} deviceId - ThingsBoard device ID
 */
const removeDeviceConnection = (deviceId) => {
    if (thingsBoardWsConnections.has(deviceId)) {
        thingsBoardWsConnections.get(deviceId).close();
        thingsBoardWsConnections.delete(deviceId);
    }
};

/**
 * Emit event to all connected clients
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
const emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};

/**
 * Emit event to a specific room
 * @param {string} room - Room name
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
const emitToRoom = (room, event, data) => {
    if (io) {
        io.to(room).emit(event, data);
    }
};

/**
 * Get Socket.IO instance
 * @returns {Object} - Socket.IO instance
 */
const getIO = () => {
    return io;
};

module.exports = {
    initialize,
    emitEvent,
    emitToRoom,
    getIO,
    addDeviceConnection,
    removeDeviceConnection
};