const DoorRequest = require('../models/doorRequest');
const { validationResult } = require('express-validator');
const { handleSuccess, handleError } = require('../utils/responseHandler');

// Lấy trạng thái yêu cầu mở cửa hiện tại
exports.getDoorRequestStatus = async (req, res) => {
    try {
        const { buildingId, floorId, doorId } = req.params;

        // Tìm yêu cầu mở cửa gần nhất cho cửa này
        const latestRequest = await DoorRequest.findOne({
            where: {
                building_id: buildingId,
                floor_id: floorId,
                door_id: doorId,
                status: 'pending' // Chỉ lấy yêu cầu đang chờ xử lý
            },
            order: [['created_at', 'DESC']]
        });

        if (!latestRequest) {
            return res.json({
                success: true,
                data: {
                    hasPendingRequest: false
                }
            });
        }

        res.json({
            success: true,
            data: {
                hasPendingRequest: true,
                request: {
                    id: latestRequest.id,
                    requester_name: latestRequest.requester_name,
                    created_at: latestRequest.created_at
                }
            }
        });
    } catch (error) {
        console.error('Error getting door request status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Check if a door has any pending request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.checkDoorRequestStatus = async (req, res) => {
    try {
        const { buildingId, floorId, doorId } = req.params;

        // Find any pending request for the door
        const pendingRequest = await DoorRequest.findOne({
            door_id: doorId,
            status: 'pending',
            deleted_at: null
        });

        return handleSuccess(res, {
            hasPendingRequest: !!pendingRequest,
            requestDetails: pendingRequest ? {
                id: pendingRequest.id,
                requester_name: pendingRequest.requester_name,
                created_at: pendingRequest.created_at
            } : null
        });
    } catch (error) {
        return handleError(res, error);
    }
};

// Các controller methods khác giữ nguyên
// ... existing code ... 