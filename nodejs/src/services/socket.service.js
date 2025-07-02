let io;
const WebSocket = require('ws');
const config = require('@config/config');
const thingsBoardService = require('./thingsboard.service');
const doorModel = require('../models/door.model');
const doorRequestModel = require('@models/doorRequest.model');
const doorLockModel = require('@models/doorLock.model');
const activityLogger = require('@utils/activityLogger');
const knex = require('@config/knex');

// WebSocket connections map
const thingsBoardWsConnections = new Map();
let jwtToken = null;

// ThingsBoard subscription command IDs
const SUBSCRIPTION_IDS = {
    TELEMETRY: 10,      // Latest telemetry data
    CLIENT_ATTR: 11,    // Client-side attributes
    SHARED_ATTR: 12     // Shared attributes
};

// Cache for processed requests to prevent duplicates
const processedRequests = new Map();
const CACHE_TIMEOUT = 5000; // 5 seconds

// Hàm kiểm tra request đã được xử lý chưa
const isRequestProcessed = (key) => {
    const now = Date.now();
    const processed = processedRequests.get(key);
    if (!processed) return false;
    
    // Nếu request đã được xử lý trong vòng 5 giây, coi như trùng lặp
    if (now - processed < CACHE_TIMEOUT) {
        return true;
    }
    
    // Xóa các key cũ (quá 5 giây)
    processedRequests.delete(key);
    return false;
};

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
                        cmdId: SUBSCRIPTION_IDS.TELEMETRY
                    }
                ],
                historyCmds: [],
                attrSubCmds: [
                    {
                        entityType: "DEVICE",
                        entityId: deviceId,
                        scope: "CLIENT_SCOPE",
                        cmdId: SUBSCRIPTION_IDS.CLIENT_ATTR
                    },
                    {
                        entityType: "DEVICE",
                        entityId: deviceId,
                        scope: "SHARED_SCOPE",
                        cmdId: SUBSCRIPTION_IDS.SHARED_ATTR
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
        console.log('Processing telemetry data:', JSON.stringify(data, null, 2));
        
        // Kiểm tra dữ liệu khởi động từ cả telemetry và attributes
        const isStartupData = (
            // Telemetry historical data
            (data.subscriptionId === SUBSCRIPTION_IDS.TELEMETRY && !data.data.ts) ||
            // Attribute data during startup
            (data.subscriptionId === SUBSCRIPTION_IDS.CLIENT_ATTR || 
             data.subscriptionId === SUBSCRIPTION_IDS.SHARED_ATTR)
        );
        
        if (isStartupData) {
            console.log('Skipping startup data processing');
            return;
        }

        // Lấy thông tin door từ device ID
        const door = await doorModel.getByThingsBoardDeviceId(deviceId);
        if (!door) {
            console.error(`Door not found for device ${deviceId}`);
            return;
        }

        // Chỉ xử lý dữ liệu telemetry (subscriptionId: 10)
        if (data.subscriptionId !== SUBSCRIPTION_IDS.TELEMETRY) {
            console.log(`Skipping non-telemetry data (subscriptionId: ${data.subscriptionId})`);
            return;
        }

        // Xử lý dữ liệu telemetry
        if (data.data) {
            // Extract latest values from telemetry arrays
            const getLatestValue = (field) => {
                if (data.data[field] && Array.isArray(data.data[field]) && data.data[field].length > 0) {
                    return data.data[field][data.data[field].length - 1][1]; // Get the value part of [timestamp, value]
                }
                return null;
            };

            // Xử lý lock_status
            if (data.data.lock_status) {
                const lockStatusData = data.data.lock_status;
                if (Array.isArray(lockStatusData) && lockStatusData.length > 0) {
                    const [timestamp, status] = lockStatusData[lockStatusData.length - 1];
                    console.log(`Received lock status update from ThingsBoard: ${status}`);

                    await doorLockModel.updateLockStatus(
                        door.floor_id,
                        door.id,
                        status, // Sử dụng trạng thái từ ThingsBoard
                        null, // userId
                        null, // requestId
                        'Status update from ThingsBoard'
                    );

                    // Emit event to connected clients
                    if (io) {
                        io.emit('door-status-update', {
                            door_id: door.id,
                            lock_status: status,
                            timestamp: new Date(timestamp).toISOString()
                        });
                    }
                }
            }

            // Xử lý request data
            const requesterName = getLatestValue('requester_name');
            const purpose = getLatestValue('purpose');
            const timestamp = getLatestValue('ts') || Date.now();

            if (requesterName && purpose) {
                // Tạo key duy nhất cho request này
                const requestKey = `${deviceId}_${requesterName}_${purpose}_${timestamp}`;
                
                // Kiểm tra xem request này đã được xử lý chưa
                if (isRequestProcessed(requestKey)) {
                    console.log(`Skipping duplicate request: ${requestKey}`);
                    return;
                }
                
                // Đánh dấu request này đã được xử lý
                processedRequests.set(requestKey, Date.now());

                const requestData = {
                    door_id: door.id,
                    requester_name: requesterName,
                    requester_phone: getLatestValue('requester_phone') || null,
                    requester_email: getLatestValue('requester_email') || null,
                    purpose: purpose,
                    status: 'approved' // Đặt trạng thái mặc định là approved
                };

                try {
                    console.log('Creating new request with data:', JSON.stringify(requestData, null, 2));
                    
                    // Tạo door request mới với trạng thái approved
                    const requestId = await doorRequestModel.create(requestData);
                    console.log(`Created request with ID: ${requestId}`);
                    
                    const newRequest = await doorRequestModel.getById(requestId);

                    // Log activity cho việc tạo và auto-approve request
                    await activityLogger.log({
                        user_id: null,
                        action: 'Created and auto-approved door request via ThingsBoard',
                        entity_type: 'door_request',
                        entity_id: requestId,
                        details: {
                            door_id: door.id,
                            door_name: door.name,
                            requester_name: requestData.requester_name,
                            purpose: requestData.purpose,
                            source: 'thingsboard',
                            auto_approved: true,
                            timestamp: timestamp
                        },
                        ip_address: null
                    });

                    // Update door lock status
                    await doorLockModel.updateLockStatus(
                        door.floor_id,
                        door.id,
                        data.data.lock_status[data.data.lock_status.length - 1][1], // Lấy trạng thái mới nhất từ telemetry
                        null, // userId
                        requestId,
                        'Auto-approved ThingsBoard request'
                    );

                    // Emit socket events
                    if (io) {
                        // Emit new request notification
                        io.emit('new-door-request', {
                            id: requestId,
                            door_id: door.id,
                            door_name: door.name,
                            requester_name: requestData.requester_name,
                            created_at: newRequest.created_at,
                            status: 'approved'
                        });

                        // Emit approval status
                        io.emit('door-request-status-update', {
                            request_id: requestId,
                            status: 'approved',
                            door_id: door.id,
                            door_name: door.name,
                            updated_by: 'system'
                        });
                    }

                    console.log(`Successfully created and approved request ${requestId} for door ${door.id}`);
                } catch (error) {
                    console.error('Error processing door request:', error);
                    // Xóa khỏi cache nếu xử lý thất bại để có thể thử lại
                    processedRequests.delete(requestKey);
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

/**
 * Update request status and handle related operations
 * @param {number} requestId - Request ID
 * @param {string} status - New status
 * @param {Object} options - Additional options
 * @returns {Promise<void>}
 */
const updateRequestStatus = async (requestId, status, options = {}) => {
    try {
        // Update request status
        await doorRequestModel.updateStatus(requestId, status);

        // Get updated request details
        const request = await doorRequestModel.getById(requestId);
        if (!request) {
            throw new Error(`Request ${requestId} not found`);
        }

        // Get door details
        const door = await doorModel.getById(null, request.door_id);
        if (!door) {
            throw new Error(`Door ${request.door_id} not found`);
        }

        // Log activity
        await activityLogger.log({
            user_id: options.userId || null,
            action: `Updated door request status to ${status}`,
            entity_type: 'door_request',
            entity_id: requestId,
            details: {
                door_id: door.id,
                door_name: door.name,
                old_status: request.status,
                new_status: status,
                source: options.source || 'system'
            },
            ip_address: options.ipAddress || null
        });

        // If request is approved, create door lock record
        if (status === 'approved') {
            const lockData = {
                door_id: door.id,
                request_id: requestId,
                status: 'active',
                start_time: new Date(),
                end_time: new Date(Date.now() + 30 * 60 * 1000), // 30 phút
                created_by: options.userId || null
            };

            const lockId = await doorLockModel.create(lockData);

            // Update door status in ThingsBoard if integrated
            if (door.thingsboard_device_id) {
                await thingsBoardService.updateDeviceAttributes(door.thingsboard_device_id, {
                    status: 'active',
                    lockStatus: 'open',
                    lastUpdatedBy: options.userId ? 'user' : 'system',
                    lastUpdateReason: options.reason || `Request ${requestId} approved`
                });

                // Send telemetry data
                await thingsBoardService.sendTelemetry(door.thingsboard_device_id, {
                    ts: Date.now(),
                    lockStatus: 'open',
                    userId: options.userId,
                    requestId: requestId,
                    reason: options.reason || `Request ${requestId} approved`
                });
            }

            // Emit socket events
            if (io) {
                io.emit('door-request-status-update', {
                    request_id: requestId,
                    status: status,
                    door_id: door.id,
                    door_name: door.name,
                    updated_by: options.userId || 'system'
                });

                io.emit('door-lock-created', {
                    id: lockId,
                    door_id: door.id,
                    request_id: requestId,
                    status: 'active'
                });
            }
        } else {
            // Emit status update event for non-approved statuses
            if (io) {
                io.emit('door-request-status-update', {
                    request_id: requestId,
                    status: status,
                    door_id: door.id,
                    door_name: door.name,
                    updated_by: options.userId || 'system'
                });
            }
        }
    } catch (error) {
        console.error(`Error updating request ${requestId} status to ${status}:`, error);
        throw error;
    }
};

module.exports = {
    initialize,
    emitEvent,
    emitToRoom,
    getIO,
    addDeviceConnection,
    removeDeviceConnection,
    updateRequestStatus
};