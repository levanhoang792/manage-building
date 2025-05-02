const express = require('express');
const router = express.Router();
const doorCoordinateController = require('../controllers/doorCoordinateController');
const { body } = require('express-validator');
const auth = require('../middleware/auth');

// Middleware xác thực
router.use(auth.authenticate);

// Validation cho tạo/cập nhật tọa độ
const coordinateValidation = [
  body('x_coordinate').isNumeric().withMessage('X coordinate must be a number'),
  body('y_coordinate').isNumeric().withMessage('Y coordinate must be a number'),
  body('z_coordinate').optional().isNumeric().withMessage('Z coordinate must be a number'),
  body('rotation').optional().isNumeric().withMessage('Rotation must be a number')
];

// Lấy danh sách tọa độ của cửa
router.get('/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates', doorCoordinateController.getDoorCoordinates);

// Lấy chi tiết tọa độ cửa
router.get('/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id', doorCoordinateController.getDoorCoordinateById);

// Tạo tọa độ cửa mới
router.post('/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates', coordinateValidation, doorCoordinateController.createDoorCoordinate);

// Cập nhật tọa độ cửa
router.put('/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id', coordinateValidation, doorCoordinateController.updateDoorCoordinate);

// Xóa tọa độ cửa
router.delete('/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id', doorCoordinateController.deleteDoorCoordinate);

module.exports = router;