const buildingModel = require('../models/building.model');
const { responseHandler } = require('../utils/responseHandler');
const responseCodes = require('../utils/responseCodes');

/**
 * Get all buildings with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBuildings = async (req, res) => {
  try {
    const { page, limit, search, status, sortBy, sortOrder } = req.query;
    
    const result = await buildingModel.getAll({
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder
    });
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Buildings retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Error getting buildings:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to retrieve buildings'
    });
  }
};

/**
 * Get building by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getBuildingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const building = await buildingModel.getById(id);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Building retrieved successfully',
      data: building
    });
  } catch (error) {
    console.error('Error getting building:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to retrieve building'
    });
  }
};

/**
 * Create new building
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createBuilding = async (req, res) => {
  try {
    const buildingData = req.body;
    
    // Set default status if not provided
    if (!buildingData.status) {
      buildingData.status = 'active';
    }
    
    const id = await buildingModel.create(buildingData);
    
    const newBuilding = await buildingModel.getById(id);
    
    return responseHandler(res, responseCodes.CREATED, {
      message: 'Building created successfully',
      data: newBuilding
    });
  } catch (error) {
    console.error('Error creating building:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to create building'
    });
  }
};

/**
 * Update building
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const buildingData = req.body;
    
    // Check if building exists
    const existingBuilding = await buildingModel.getById(id);
    
    if (!existingBuilding) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    await buildingModel.update(id, buildingData);
    
    const updatedBuilding = await buildingModel.getById(id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Building updated successfully',
      data: updatedBuilding
    });
  } catch (error) {
    console.error('Error updating building:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to update building'
    });
  }
};

/**
 * Update building status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateBuildingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return responseHandler(res, responseCodes.BAD_REQUEST, {
        message: 'Invalid status. Status must be either "active" or "inactive"'
      });
    }
    
    // Check if building exists
    const existingBuilding = await buildingModel.getById(id);
    
    if (!existingBuilding) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    await buildingModel.updateStatus(id, status);
    
    const updatedBuilding = await buildingModel.getById(id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Building status updated successfully',
      data: updatedBuilding
    });
  } catch (error) {
    console.error('Error updating building status:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to update building status'
    });
  }
};

/**
 * Delete building
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if building exists
    const existingBuilding = await buildingModel.getById(id);
    
    if (!existingBuilding) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    await buildingModel.remove(id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Building deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting building:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to delete building'
    });
  }
};

module.exports = {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  updateBuildingStatus,
  deleteBuilding
};