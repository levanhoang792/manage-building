const doorService = require('../services/doorService');
const { validationResult } = require('express-validator');
const { errorResponse, successResponse } = require('../utils/response');

/**
 * Lấy danh sách cửa trong tầng
 */
exports.getDoors = async (req, res) => {
  try {
    const { buildingId, floorId } = req.params;
    const { page = 1, limit = 10, search, type, status, sortBy, sortOrder } = req.query;
    
    const result = await doorService.getDoors(
      buildingId, 
      floorId, 
      { page, limit, search, type, status, sortBy, sortOrder }
    );
    
    return successResponse(res, result);
  } catch (error) {
    console.error('Error in getDoors:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};

/**
 * Lấy chi tiết cửa
 */
exports.getDoorById = async (req, res) => {
  try {
    const { buildingId, floorId, id } = req.params;
    
    const door = await doorService.getDoorById(buildingId, floorId, id);
    
    return successResponse(res, door);
  } catch (error) {
    console.error('Error in getDoorById:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};

/**
 * Tạo cửa mới
 */
exports.createDoor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation error', 400, errors.array());
    }
    
    const { buildingId, floorId } = req.params;
    const doorData = req.body;
    
    const newDoor = await doorService.createDoor(buildingId, floorId, doorData);
    
    return successResponse(res, newDoor, 201);
  } catch (error) {
    console.error('Error in createDoor:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};

/**
 * Cập nhật thông tin cửa
 */
exports.updateDoor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation error', 400, errors.array());
    }
    
    const { buildingId, floorId, id } = req.params;
    const doorData = req.body;
    
    const updatedDoor = await doorService.updateDoor(buildingId, floorId, id, doorData);
    
    return successResponse(res, updatedDoor);
  } catch (error) {
    console.error('Error in updateDoor:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};

/**
 * Xóa cửa
 */
exports.deleteDoor = async (req, res) => {
  try {
    const { buildingId, floorId, id } = req.params;
    
    await doorService.deleteDoor(buildingId, floorId, id);
    
    return successResponse(res, { message: 'Door deleted successfully' });
  } catch (error) {
    console.error('Error in deleteDoor:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};

/**
 * Cập nhật trạng thái cửa
 */
exports.updateDoorStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation error', 400, errors.array());
    }
    
    const { buildingId, floorId, id } = req.params;
    const { status } = req.body;
    
    const updatedDoor = await doorService.updateDoorStatus(buildingId, floorId, id, status);
    
    return successResponse(res, updatedDoor);
  } catch (error) {
    console.error('Error in updateDoorStatus:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};