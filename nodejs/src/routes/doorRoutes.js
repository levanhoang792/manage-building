const express = require('express');
const router = express.Router();
const doorController = require('../controllers/doorController');
const { body } = require('express-validator');
const auth = require('../middleware/auth');

// Middleware xác thực
router.use(auth.authenticate);

// Validation cho tạo/cập nhật cửa
const doorValidation = [
  body('name').notEmpty().withMessage('Door name is required'),
  body('type').isIn(['main', 'emergency', 'service', 'other']).withMessage('Invalid door type'),
  body('status').isIn(['active', 'inactive', 'maintenance']).withMessage('Invalid door status')
];

// Validation cho cập nhật trạng thái
const statusValidation = [
  body('status').isIn(['active', 'inactive', 'maintenance']).withMessage('Invalid door status')
];

// Lấy danh sách cửa trong tầng
router.get('/buildings/:buildingId/floors/:floorId/doors', doorController.getDoors);

// Lấy chi tiết cửa
router.get('/buildings/:buildingId/floors/:floorId/doors/:id', doorController.getDoorById);

// Tạo cửa mới
router.post('/buildings/:buildingId/floors/:floorId/doors', doorValidation, doorController.createDoor);

// Cập nhật thông tin cửa
router.put('/buildings/:buildingId/floors/:floorId/doors/:id', doorValidation, doorController.updateDoor);

// Xóa cửa
router.delete('/buildings/:buildingId/floors/:floorId/doors/:id', doorController.deleteDoor);

// Cập nhật trạng thái cửa
router.patch('/buildings/:buildingId/floors/:floorId/doors/:id/status', statusValidation, doorController.updateDoorStatus);

module.exports = router;