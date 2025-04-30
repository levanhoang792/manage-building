const doorCoordinateModel = require('../models/doorCoordinate.model');
const doorModel = require('../models/door.model');
const floorModel = require('../models/floor.model');
const buildingModel = require('../models/building.model');
const { responseHandler } = require('../utils/responseHandler');
const responseCodes = require('../utils/responseCodes');

/**
 * Get coordinates for a door
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorCoordinates = async (req, res) => {
  try {
    const { buildingId, floorId, doorId } = req.params;
    
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
    const door = await doorModel.getById(floorId, doorId);
    
    if (!door) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door not found'
      });
    }
    
    const coordinates = await doorCoordinateModel.getByDoorId(doorId);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Door coordinates retrieved successfully',
      data: coordinates
    });
  } catch (error) {
    console.error('Error getting door coordinates:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to retrieve door coordinates'
    });
  }
};

/**
 * Get door coordinate by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDoorCoordinateById = async (req, res) => {
  try {
    const { buildingId, floorId, doorId, id } = req.params;
    
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
    const door = await doorModel.getById(floorId, doorId);
    
    if (!door) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door not found'
      });
    }
    
    const coordinate = await doorCoordinateModel.getById(doorId, id);
    
    if (!coordinate) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door coordinate not found'
      });
    }
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Door coordinate retrieved successfully',
      data: coordinate
    });
  } catch (error) {
    console.error('Error getting door coordinate:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to retrieve door coordinate'
    });
  }
};

/**
 * Create new door coordinate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createDoorCoordinate = async (req, res) => {
  try {
    const { buildingId, floorId, doorId } = req.params;
    const coordinateData = req.body;
    
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
    const door = await doorModel.getById(floorId, doorId);
    
    if (!door) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door not found'
      });
    }
    
    // Validate required fields
    if (!coordinateData.x_coordinate || !coordinateData.y_coordinate) {
      return responseHandler(res, responseCodes.BAD_REQUEST, {
        message: 'x_coordinate and y_coordinate are required'
      });
    }
    
    // Set door ID
    coordinateData.door_id = doorId;
    
    const id = await doorCoordinateModel.create(coordinateData);
    
    const newCoordinate = await doorCoordinateModel.getById(doorId, id);
    
    return responseHandler(res, responseCodes.CREATED, {
      message: 'Door coordinate created successfully',
      data: newCoordinate
    });
  } catch (error) {
    console.error('Error creating door coordinate:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to create door coordinate'
    });
  }
};

/**
 * Update door coordinate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateDoorCoordinate = async (req, res) => {
  try {
    const { buildingId, floorId, doorId, id } = req.params;
    const coordinateData = req.body;
    
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
    const door = await doorModel.getById(floorId, doorId);
    
    if (!door) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door not found'
      });
    }
    
    // Check if coordinate exists
    const existingCoordinate = await doorCoordinateModel.getById(doorId, id);
    
    if (!existingCoordinate) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door coordinate not found'
      });
    }
    
    // Ensure door_id cannot be changed
    delete coordinateData.door_id;
    
    await doorCoordinateModel.update(doorId, id, coordinateData);
    
    const updatedCoordinate = await doorCoordinateModel.getById(doorId, id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Door coordinate updated successfully',
      data: updatedCoordinate
    });
  } catch (error) {
    console.error('Error updating door coordinate:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to update door coordinate'
    });
  }
};

/**
 * Delete door coordinate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteDoorCoordinate = async (req, res) => {
  try {
    const { buildingId, floorId, doorId, id } = req.params;
    
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
    const door = await doorModel.getById(floorId, doorId);
    
    if (!door) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door not found'
      });
    }
    
    // Check if coordinate exists
    const existingCoordinate = await doorCoordinateModel.getById(doorId, id);
    
    if (!existingCoordinate) {
      return responseHandler(res, responseCodes.NOT_FOUND, {
        message: 'Door coordinate not found'
      });
    }
    
    await doorCoordinateModel.remove(doorId, id);
    
    return responseHandler(res, responseCodes.SUCCESS, {
      message: 'Door coordinate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting door coordinate:', error);
    return responseHandler(res, responseCodes.SERVER_ERROR, {
      message: 'Failed to delete door coordinate'
    });
  }
};

module.exports = {
  getDoorCoordinates,
  getDoorCoordinateById,
  createDoorCoordinate,
  updateDoorCoordinate,
  deleteDoorCoordinate
};