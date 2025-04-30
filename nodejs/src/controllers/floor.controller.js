const floorModel = require('../models/floor.model');
const buildingModel = require('../models/building.model');
const { responseHandler } = require('../utils/responseHandler');
const responseCodes = require('../utils/responseCodes');
const path = require('path');
const fs = require('fs');

/**
 * Get all floors for a building with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFloors = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const { page, limit, search, status, sortBy, sortOrder } = req.query;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    const result = await floorModel.getAllByBuilding(buildingId, {
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder
    });
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Floors retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Error getting floors:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to retrieve floors'
    });
  }
};

/**
 * Get floor by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFloorById = async (req, res) => {
  try {
    const { buildingId, id } = req.params;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    const floor = await floorModel.getById(buildingId, id);
    
    if (!floor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Floor retrieved successfully',
      data: floor
    });
  } catch (error) {
    console.error('Error getting floor:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to retrieve floor'
    });
  }
};

/**
 * Create new floor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createFloor = async (req, res) => {
  try {
    const { buildingId } = req.params;
    const floorData = req.body;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Set building ID and default status if not provided
    floorData.building_id = buildingId;
    if (!floorData.status) {
      floorData.status = 'active';
    }
    
    const id = await floorModel.create(floorData);
    
    const newFloor = await floorModel.getById(buildingId, id);
    
    return responseHandler(res, responseCodes.CREATED, {
      message: 'Floor created successfully',
      data: newFloor
    });
  } catch (error) {
    console.error('Error creating floor:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to create floor'
    });
  }
};

/**
 * Update floor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateFloor = async (req, res) => {
  try {
    const { buildingId, id } = req.params;
    const floorData = req.body;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Check if floor exists
    const existingFloor = await floorModel.getById(buildingId, id);
    
    if (!existingFloor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    // Ensure building_id cannot be changed
    delete floorData.building_id;
    
    await floorModel.update(buildingId, id, floorData);
    
    const updatedFloor = await floorModel.getById(buildingId, id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Floor updated successfully',
      data: updatedFloor
    });
  } catch (error) {
    console.error('Error updating floor:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to update floor'
    });
  }
};

/**
 * Update floor status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateFloorStatus = async (req, res) => {
  try {
    const { buildingId, id } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return responseHandler(res, responseCodes.BAD_REQUEST, {
        message: 'Invalid status. Status must be either "active" or "inactive"'
      });
    }
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Check if floor exists
    const existingFloor = await floorModel.getById(buildingId, id);
    
    if (!existingFloor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    await floorModel.updateStatus(buildingId, id, status);
    
    const updatedFloor = await floorModel.getById(buildingId, id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Floor status updated successfully',
      data: updatedFloor
    });
  } catch (error) {
    console.error('Error updating floor status:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to update floor status'
    });
  }
};

/**
 * Upload floor plan image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadFloorPlan = async (req, res) => {
  try {
    const { buildingId, id } = req.params;
    
    if (!req.file) {
      return responseHandler(res, responseCodes.BAD_REQUEST, {
        message: 'No file uploaded'
      });
    }
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Check if floor exists
    const existingFloor = await floorModel.getById(buildingId, id);
    
    if (!existingFloor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    // If there's an existing floor plan, delete it
    if (existingFloor.floor_plan_image) {
      const oldImagePath = path.join(__dirname, '../../', existingFloor.floor_plan_image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Save the new floor plan path
    const imagePath = `/uploads/floor-plans/${req.file.filename}`;
    await floorModel.updateFloorPlan(buildingId, id, imagePath);
    
    const updatedFloor = await floorModel.getById(buildingId, id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Floor plan uploaded successfully',
      data: updatedFloor
    });
  } catch (error) {
    console.error('Error uploading floor plan:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to upload floor plan'
    });
  }
};

/**
 * Delete floor
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteFloor = async (req, res) => {
  try {
    const { buildingId, id } = req.params;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Check if floor exists
    const existingFloor = await floorModel.getById(buildingId, id);
    
    if (!existingFloor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    // If there's a floor plan image, delete it
    if (existingFloor.floor_plan_image) {
      const imagePath = path.join(__dirname, '../../', existingFloor.floor_plan_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await floorModel.remove(buildingId, id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Floor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting floor:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to delete floor'
    });
  }
};

module.exports = {
  getFloors,
  getFloorById,
  createFloor,
  updateFloor,
  updateFloorStatus,
  uploadFloorPlan,
  deleteFloor
};