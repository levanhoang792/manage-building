const express = require('express');
const router = express.Router({ mergeParams: true });
const floorController = require('../controllers/floor.controller');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/floor-plans');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `floor-plan-${req.params.buildingId}-${req.params.id}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

/**
 * @route GET /api/buildings/:buildingId/floors
 * @desc Get all floors for a building
 * @access Private
 */
router.get('/', authMiddleware.verifyToken, floorController.getFloors);

/**
 * @route GET /api/buildings/:buildingId/floors/:id
 * @desc Get floor by ID
 * @access Private
 */
router.get('/:id', authMiddleware.verifyToken, floorController.getFloorById);

/**
 * @route POST /api/buildings/:buildingId/floors
 * @desc Create new floor
 * @access Private
 */
router.post('/', authMiddleware.verifyToken, floorController.createFloor);

/**
 * @route PUT /api/buildings/:buildingId/floors/:id
 * @desc Update floor
 * @access Private
 */
router.put('/:id', authMiddleware.verifyToken, floorController.updateFloor);

/**
 * @route PATCH /api/buildings/:buildingId/floors/:id/status
 * @desc Update floor status
 * @access Private
 */
router.patch('/:id/status', authMiddleware.verifyToken, floorController.updateFloorStatus);

/**
 * @route POST /api/buildings/:buildingId/floors/:id/upload-plan
 * @desc Upload floor plan image
 * @access Private
 */
router.post('/:id/upload-plan', authMiddleware.verifyToken, upload.single('floorPlan'), floorController.uploadFloorPlan);

/**
 * @route DELETE /api/buildings/:buildingId/floors/:id
 * @desc Delete floor
 * @access Private
 */
router.delete('/:id', authMiddleware.verifyToken, floorController.deleteFloor);

module.exports = router;