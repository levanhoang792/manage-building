const doorCoordinateService = require('../services/doorCoordinateService');
const { validationResult } = require('express-validator');
const { errorResponse, successResponse } = require('../utils/response');

/**
 * Lấy danh sách tọa độ của cửa
 */
exports.getDoorCoordinates = async (req, res) => {
  try {
    const { buildingId, floorId, doorId } = req.params;
    
    const coordinates = await doorCoordinateService.getDoorCoordinates(buildingId, floorId, doorId);
    
    return successResponse(res, coordinates);
  } catch (error) {
    console.error('Error in getDoorCoordinates:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};

/**
 * Lấy chi tiết tọa độ cửa
 */
exports.getDoorCoordinateById = async (req, res) => {
  try {
    const { buildingId, floorId, doorId, id } = req.params;
    
    const coordinate = await doorCoordinateService.getDoorCoordinateById(buildingId, floorId, doorId, id);
    
    return successResponse(res, coordinate);
  } catch (error) {
    console.error('Error in getDoorCoordinateById:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};

/**
 * Tạo tọa độ cửa mới
 */
exports.createDoorCoordinate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation error', 400, errors.array());
    }
    
    const { buildingId, floorId, doorId } = req.params;
    const coordinateData = req.body;
    
    const newCoordinate = await doorCoordinateService.createDoorCoordinate(
      buildingId, 
      floorId, 
      doorId, 
      coordinateData
    );
    
    return successResponse(res, newCoordinate, 201);
  } catch (error) {
    console.error('Error in createDoorCoordinate:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};

/**
 * Cập nhật tọa độ cửa
 */
exports.updateDoorCoordinate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation error', 400, errors.array());
    }
    
    const { buildingId, floorId, doorId, id } = req.params;
    const coordinateData = req.body;
    
    const updatedCoordinate = await doorCoordinateService.updateDoorCoordinate(
      buildingId, 
      floorId, 
      doorId, 
      id, 
      coordinateData
    );
    
    return successResponse(res, updatedCoordinate);
  } catch (error) {
    console.error('Error in updateDoorCoordinate:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};

/**
 * Xóa tọa độ cửa
 */
exports.deleteDoorCoordinate = async (req, res) => {
  try {
    const { buildingId, floorId, doorId, id } = req.params;
    
    await doorCoordinateService.deleteDoorCoordinate(buildingId, floorId, doorId, id);
    
    return successResponse(res, { message: 'Door coordinate deleted successfully' });
  } catch (error) {
    console.error('Error in deleteDoorCoordinate:', error);
    return errorResponse(res, error.message, error.statusCode);
  }
};