const doorModel = require('../models/door.model');
const floorModel = require('../models/floor.model');
const buildingModel = require('../models/building.model');
const { responseHandler } = require('../utils/responseHandler');
const responseCodes = require('../utils/responseCodes');

/**
 * Get all doors for a floor with pagination and filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoors = async (req, res) => {
  try {
    const { buildingId, floorId } = req.params;
    const { page, limit, search, type, status, sortBy, sortOrder } = req.query;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Check if floor exists
    const floor = await floorModel.getById(buildingId, floorId);
    
    if (!floor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    const result = await doorModel.getAllByFloor(floorId, {
      page,
      limit,
      search,
      type,
      status,
      sortBy,
      sortOrder
    });
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Doors retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Error getting doors:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to retrieve doors'
    });
  }
};

/**
 * Get door by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorById = async (req, res) => {
  try {
    const { buildingId, floorId, id } = req.params;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Check if floor exists
    const floor = await floorModel.getById(buildingId, floorId);
    
    if (!floor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    const door = await doorModel.getById(floorId, id);
    
    if (!door) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door not found'
      });
    }
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Door retrieved successfully',
      data: door
    });
  } catch (error) {
    console.error('Error getting door:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to retrieve door'
    });
  }
};

/**
 * Create new door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDoor = async (req, res) => {
  try {
    const { buildingId, floorId } = req.params;
    const doorData = req.body;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Check if floor exists
    const floor = await floorModel.getById(buildingId, floorId);
    
    if (!floor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    // Set floor ID and default status if not provided
    doorData.floor_id = floorId;
    if (!doorData.status) {
      doorData.status = 'active';
    }
    
    const id = await doorModel.create(doorData);
    
    const newDoor = await doorModel.getById(floorId, id);
    
    return responseHandler(res, responseCodes.CREATED, {
      message: 'Door created successfully',
      data: newDoor
    });
  } catch (error) {
    console.error('Error creating door:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to create door'
    });
  }
};

/**
 * Update door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDoor = async (req, res) => {
  try {
    const { buildingId, floorId, id } = req.params;
    const doorData = req.body;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Check if floor exists
    const floor = await floorModel.getById(buildingId, floorId);
    
    if (!floor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    // Check if door exists
    const existingDoor = await doorModel.getById(floorId, id);
    
    if (!existingDoor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door not found'
      });
    }
    
    // Ensure floor_id cannot be changed
    delete doorData.floor_id;
    
    await doorModel.update(floorId, id, doorData);
    
    const updatedDoor = await doorModel.getById(floorId, id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Door updated successfully',
      data: updatedDoor
    });
  } catch (error) {
    console.error('Error updating door:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to update door'
    });
  }
};

/**
 * Update door status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDoorStatus = async (req, res) => {
  try {
    const { buildingId, floorId, id } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'inactive', 'maintenance'].includes(status)) {
      return responseHandler(res, responseCodes.BAD_REQUEST, {
        message: 'Invalid status. Status must be one of: "active", "inactive", "maintenance"'
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
    const floor = await floorModel.getById(buildingId, floorId);
    
    if (!floor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    // Check if door exists
    const existingDoor = await doorModel.getById(floorId, id);
    
    if (!existingDoor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door not found'
      });
    }
    
    await doorModel.updateStatus(floorId, id, status);
    
    const updatedDoor = await doorModel.getById(floorId, id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Door status updated successfully',
      data: updatedDoor
    });
  } catch (error) {
    console.error('Error updating door status:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to update door status'
    });
  }
};

/**
 * Delete door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteDoor = async (req, res) => {
  try {
    const { buildingId, floorId, id } = req.params;
    
    // Check if building exists
    const building = await buildingModel.getById(buildingId);
    
    if (!building) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Building not found'
      });
    }
    
    // Check if floor exists
    const floor = await floorModel.getById(buildingId, floorId);
    
    if (!floor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Floor not found'
      });
    }
    
    // Check if door exists
    const existingDoor = await doorModel.getById(floorId, id);
    
    if (!existingDoor) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door not found'
      });
    }
    
    await doorModel.remove(floorId, id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Door deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting door:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to delete door'
    });
  }
};

module.exports = {
  getDoors,
  getDoorById,
  createDoor,
  updateDoor,
  updateDoorStatus,
  deleteDoor
};