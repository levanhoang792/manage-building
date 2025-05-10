let io;

/**
 * Initialize Socket.IO
 * @param {Object} server - HTTP server instance
 */
const initialize = (server) => {
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

    return io;
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
    getIO
};