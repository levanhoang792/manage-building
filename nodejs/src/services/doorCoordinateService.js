const DoorCoordinate = require('../models/DoorCoordinate');
const doorService = require('./doorService');
const { NotFoundError } = require('../utils/errors');

/**
 * Lấy danh sách tọa độ của cửa
 */
exports.getDoorCoordinates = async (buildingId, floorId, doorId) => {
  // Kiểm tra cửa tồn tại
  await doorService.getDoorById(buildingId, floorId, doorId);
  
  // Lấy danh sách tọa độ
  const coordinates = await DoorCoordinate.findAll({
    where: {
      door_id: doorId
    },
    order: [['created_at', 'ASC']]
  });
  
  return coordinates;
};

/**
 * Lấy chi tiết tọa độ cửa
 */
exports.getDoorCoordinateById = async (buildingId, floorId, doorId, id) => {
  // Kiểm tra cửa tồn tại
  await doorService.getDoorById(buildingId, floorId, doorId);
  
  // Tìm tọa độ
  const coordinate = await DoorCoordinate.findOne({
    where: {
      id,
      door_id: doorId
    }
  });
  
  if (!coordinate) {
    throw new NotFoundError('Door coordinate not found');
  }
  
  return coordinate;
};

/**
 * Tạo tọa độ cửa mới
 */
exports.createDoorCoordinate = async (buildingId, floorId, doorId, coordinateData) => {
  // Kiểm tra cửa tồn tại
  await doorService.getDoorById(buildingId, floorId, doorId);
  
  // Tạo tọa độ mới
  const newCoordinate = await DoorCoordinate.create({
    ...coordinateData,
    door_id: doorId
  });
  
  return newCoordinate;
};

/**
 * Cập nhật tọa độ cửa
 */
exports.updateDoorCoordinate = async (buildingId, floorId, doorId, id, coordinateData) => {
  // Kiểm tra tọa độ tồn tại
  const coordinate = await this.getDoorCoordinateById(buildingId, floorId, doorId, id);
  
  // Cập nhật thông tin tọa độ
  await coordinate.update(coordinateData);
  
  return coordinate;
};

/**
 * Xóa tọa độ cửa
 */
exports.deleteDoorCoordinate = async (buildingId, floorId, doorId, id) => {
  // Kiểm tra tọa độ tồn tại
  const coordinate = await this.getDoorCoordinateById(buildingId, floorId, doorId, id);
  
  // Xóa tọa độ
  await coordinate.destroy();
  
  return true;
};