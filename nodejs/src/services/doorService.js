const Door = require('../models/Door');
const Floor = require('../models/Floor');
const Building = require('../models/Building');
const { Op } = require('sequelize');
const { NotFoundError, BadRequestError } = require('../utils/errors');

/**
 * Lấy danh sách cửa trong tầng
 */
exports.getDoors = async (buildingId, floorId, options = {}) => {
  const { page = 1, limit = 10, search, type, status, sortBy = 'created_at', sortOrder = 'desc' } = options;
  
  // Kiểm tra tòa nhà và tầng tồn tại
  const building = await Building.findByPk(buildingId);
  if (!building) {
    throw new NotFoundError('Building not found');
  }
  
  const floor = await Floor.findOne({
    where: {
      id: floorId,
      building_id: buildingId
    }
  });
  
  if (!floor) {
    throw new NotFoundError('Floor not found');
  }
  
  // Xây dựng điều kiện tìm kiếm
  const whereCondition = {
    floor_id: floorId
  };
  
  if (search) {
    whereCondition.name = {
      [Op.like]: `%${search}%`
    };
  }
  
  if (type) {
    whereCondition.type = type;
  }
  
  if (status) {
    whereCondition.status = status;
  }
  
  // Xây dựng điều kiện sắp xếp
  const order = [[sortBy, sortOrder.toUpperCase()]];
  
  // Tính toán offset cho phân trang
  const offset = (page - 1) * limit;
  
  // Truy vấn dữ liệu
  const { count, rows } = await Door.findAndCountAll({
    where: whereCondition,
    order,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
  
  return {
    data: rows,
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    total_pages: Math.ceil(count / limit)
  };
};

/**
 * Lấy chi tiết cửa
 */
exports.getDoorById = async (buildingId, floorId, id) => {
  // Kiểm tra tòa nhà và tầng tồn tại
  const building = await Building.findByPk(buildingId);
  if (!building) {
    throw new NotFoundError('Building not found');
  }
  
  const floor = await Floor.findOne({
    where: {
      id: floorId,
      building_id: buildingId
    }
  });
  
  if (!floor) {
    throw new NotFoundError('Floor not found');
  }
  
  // Tìm cửa
  const door = await Door.findOne({
    where: {
      id,
      floor_id: floorId
    }
  });
  
  if (!door) {
    throw new NotFoundError('Door not found');
  }
  
  return door;
};

/**
 * Tạo cửa mới
 */
exports.createDoor = async (buildingId, floorId, doorData) => {
  // Kiểm tra tòa nhà và tầng tồn tại
  const building = await Building.findByPk(buildingId);
  if (!building) {
    throw new NotFoundError('Building not found');
  }
  
  const floor = await Floor.findOne({
    where: {
      id: floorId,
      building_id: buildingId
    }
  });
  
  if (!floor) {
    throw new NotFoundError('Floor not found');
  }
  
  // Tạo cửa mới
  const newDoor = await Door.create({
    ...doorData,
    floor_id: floorId
  });
  
  return newDoor;
};

/**
 * Cập nhật thông tin cửa
 */
exports.updateDoor = async (buildingId, floorId, id, doorData) => {
  // Kiểm tra cửa tồn tại
  const door = await this.getDoorById(buildingId, floorId, id);
  
  // Cập nhật thông tin cửa
  await door.update(doorData);
  
  return door;
};

/**
 * Xóa cửa
 */
exports.deleteDoor = async (buildingId, floorId, id) => {
  // Kiểm tra cửa tồn tại
  const door = await this.getDoorById(buildingId, floorId, id);
  
  // Xóa cửa
  await door.destroy();
  
  return true;
};

/**
 * Cập nhật trạng thái cửa
 */
exports.updateDoorStatus = async (buildingId, floorId, id, status) => {
  // Kiểm tra trạng thái hợp lệ
  const validStatuses = ['active', 'inactive', 'maintenance'];
  if (!validStatuses.includes(status)) {
    throw new BadRequestError('Invalid status');
  }
  
  // Kiểm tra cửa tồn tại
  const door = await this.getDoorById(buildingId, floorId, id);
  
  // Cập nhật trạng thái
  await door.update({ status });
  
  return door;
};