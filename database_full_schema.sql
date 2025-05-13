/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80041 (8.0.41)
 Source Host           : localhost:3306
 Source Schema         : building_management

 Target Server Type    : MySQL
 Target Server Version : 80041 (8.0.41)
 File Encoding         : 65001

 Date: 12/05/2025 23:12:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activity_logs
-- ----------------------------
DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NULL DEFAULT NULL,
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `entity_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `entity_id` int NULL DEFAULT NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of activity_logs
-- ----------------------------
INSERT INTO `activity_logs` VALUES (1, 1, 'Created door request', 'door_request', 1, '{\"door_id\":6,\"door_name\":\"Door 6\",\"requester_name\":\"ádadas\",\"purpose\":\"ấccsacs\"}', '::1', '2025-05-12 15:21:09');
INSERT INTO `activity_logs` VALUES (2, 1, 'Created door request', 'door_request', 2, '{\"door_id\":1,\"door_name\":\"Door 1\",\"requester_name\":\"sadadsa\",\"purpose\":\"094552612\"}', '::1', '2025-05-12 15:29:24');
INSERT INTO `activity_logs` VALUES (3, 1, 'Changed door lock status due to request approval', 'door', 1, '{\"door_name\":\"Door 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"request_id\":\"2\"}', '::1', '2025-05-12 15:48:13');
INSERT INTO `activity_logs` VALUES (4, 1, 'Approved door request', 'door_request', 2, '{\"requester_name\":\"sadadsa\",\"door_id\":1,\"door_name\":\"Door 1\",\"reason\":\"asdasdasd\"}', '::1', '2025-05-12 15:48:13');
INSERT INTO `activity_logs` VALUES (5, 1, 'Rejected door request', 'door_request', 1, '{\"requester_name\":\"ádadas\",\"door_id\":6,\"door_name\":\"Door 6\",\"reason\":\"zxczxc\"}', '::1', '2025-05-12 15:49:44');
INSERT INTO `activity_logs` VALUES (6, 1, 'Created door request', 'door_request', 3, '{\"door_id\":1,\"door_name\":\"Door 1\",\"requester_name\":\"sadasd\",\"purpose\":\"adadd\"}', '::1', '2025-05-12 15:59:22');
INSERT INTO `activity_logs` VALUES (7, 1, 'Rejected door request', 'door_request', 3, '{\"requester_name\":\"sadasd\",\"door_id\":1,\"door_name\":\"Door 1\",\"reason\":\"ádadas\"}', '::1', '2025-05-12 16:00:08');

-- ----------------------------
-- Table structure for building_status_history
-- ----------------------------
DROP TABLE IF EXISTS `building_status_history`;
CREATE TABLE `building_status_history`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `building_id` int NOT NULL,
  `previous_status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `new_status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `changed_by` int NULL DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `building_id`(`building_id` ASC) USING BTREE,
  INDEX `changed_by`(`changed_by` ASC) USING BTREE,
  CONSTRAINT `building_status_history_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `building_status_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of building_status_history
-- ----------------------------

-- ----------------------------
-- Table structure for buildings
-- ----------------------------
DROP TABLE IF EXISTS `buildings`;
CREATE TABLE `buildings`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `total_floors` int NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  CONSTRAINT `buildings_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of buildings
-- ----------------------------
INSERT INTO `buildings` VALUES (1, 'Building 1', 'Building 1 Address', '', 'active', 1, '2025-05-03 03:15:42', '2025-05-03 03:15:42', NULL);

-- ----------------------------
-- Table structure for door_coordinates
-- ----------------------------
DROP TABLE IF EXISTS `door_coordinates`;
CREATE TABLE `door_coordinates`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `door_id` int NOT NULL,
  `x_coordinate` float NOT NULL,
  `y_coordinate` float NOT NULL,
  `z_coordinate` float NULL DEFAULT 0,
  `rotation` float NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `door_id`(`door_id` ASC) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  CONSTRAINT `door_coordinates_ibfk_1` FOREIGN KEY (`door_id`) REFERENCES `doors` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `door_coordinates_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of door_coordinates
-- ----------------------------
INSERT INTO `door_coordinates` VALUES (5, 2, 976.286, 400.55, 0, 0, '2025-05-03 04:30:45', '2025-05-10 03:17:02', NULL);
INSERT INTO `door_coordinates` VALUES (6, 2, 41.3483, 462.022, 0, 0, '2025-05-03 04:31:08', '2025-05-10 03:17:27', NULL);
INSERT INTO `door_coordinates` VALUES (8, 1, 1084.04, 134.831, 0, 0, '2025-05-05 10:09:28', '2025-05-10 03:07:07', NULL);
INSERT INTO `door_coordinates` VALUES (9, 5, 251.685, 176.18, 0, 0, '2025-05-10 01:00:22', '2025-05-12 14:38:24', NULL);
INSERT INTO `door_coordinates` VALUES (10, 6, 406.292, 95.2809, 0, 0, '2025-05-10 01:05:47', '2025-05-12 14:38:27', NULL);

-- ----------------------------
-- Table structure for door_lock_history
-- ----------------------------
DROP TABLE IF EXISTS `door_lock_history`;
CREATE TABLE `door_lock_history`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `door_id` int NOT NULL,
  `previous_status` enum('open','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `new_status` enum('open','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `changed_by` int NULL DEFAULT NULL,
  `request_id` int NULL DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `door_id`(`door_id` ASC) USING BTREE,
  INDEX `changed_by`(`changed_by` ASC) USING BTREE,
  INDEX `request_id`(`request_id` ASC) USING BTREE,
  CONSTRAINT `door_lock_history_ibfk_1` FOREIGN KEY (`door_id`) REFERENCES `doors` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `door_lock_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `door_lock_history_ibfk_3` FOREIGN KEY (`request_id`) REFERENCES `door_requests` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of door_lock_history
-- ----------------------------
INSERT INTO `door_lock_history` VALUES (1, 1, 'closed', 'open', NULL, NULL, NULL, '2025-05-12 15:48:13');
INSERT INTO `door_lock_history` VALUES (2, 1, 'closed', 'open', 1, 2, 'Approved door request from sadadsa', '2025-05-12 15:48:13');

-- ----------------------------
-- Table structure for door_requests
-- ----------------------------
DROP TABLE IF EXISTS `door_requests`;
CREATE TABLE `door_requests`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `door_id` int NOT NULL,
  `requester_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `requester_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `requester_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `purpose` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `processed_by` int NULL DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `door_id`(`door_id` ASC) USING BTREE,
  INDEX `processed_by`(`processed_by` ASC) USING BTREE,
  CONSTRAINT `door_requests_ibfk_1` FOREIGN KEY (`door_id`) REFERENCES `doors` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `door_requests_ibfk_2` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of door_requests
-- ----------------------------
INSERT INTO `door_requests` VALUES (1, 6, 'ádadas', '0292331222', 'hoanglv@stringee.com', 'ấccsacs', 'rejected', 1, '2025-05-12 15:49:44', NULL, '2025-05-12 15:21:09', '2025-05-12 15:49:44');
INSERT INTO `door_requests` VALUES (2, 1, 'sadadsa', '094552612', 'sadadsa@gmail.com', '094552612', 'approved', 1, '2025-05-12 15:48:13', NULL, '2025-05-12 15:29:24', '2025-05-12 15:48:13');
INSERT INTO `door_requests` VALUES (3, 1, 'sadasd', '229390121', 'hoanglv@faaas.com', 'adadd', 'rejected', 1, '2025-05-12 16:00:08', 'ádadas', '2025-05-12 15:59:22', '2025-05-12 16:00:08');

-- ----------------------------
-- Table structure for door_status_history
-- ----------------------------
DROP TABLE IF EXISTS `door_status_history`;
CREATE TABLE `door_status_history`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `door_id` int NOT NULL,
  `previous_status` enum('active','inactive','maintenance') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `new_status` enum('active','inactive','maintenance') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `changed_by` int NULL DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `door_id`(`door_id` ASC) USING BTREE,
  INDEX `changed_by`(`changed_by` ASC) USING BTREE,
  CONSTRAINT `door_status_history_ibfk_1` FOREIGN KEY (`door_id`) REFERENCES `doors` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `door_status_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of door_status_history
-- ----------------------------
INSERT INTO `door_status_history` VALUES (1, 1, 'active', 'maintenance', NULL, NULL, '2025-05-05 10:09:33');
INSERT INTO `door_status_history` VALUES (2, 1, 'maintenance', 'active', NULL, NULL, '2025-05-05 10:09:35');

-- ----------------------------
-- Table structure for door_types
-- ----------------------------
DROP TABLE IF EXISTS `door_types`;
CREATE TABLE `door_types`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of door_types
-- ----------------------------
INSERT INTO `door_types` VALUES (1, 'normal', 'Cửa thông thường', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `door_types` VALUES (2, 'emergency', 'Cửa thoát hiểm', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `door_types` VALUES (3, 'restricted', 'Cửa hạn chế', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `door_types` VALUES (4, 'elevator', 'Thang máy', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `door_types` VALUES (5, 'stairway', 'Cầu thang', '2025-05-03 03:15:20', '2025-05-03 03:15:20');

-- ----------------------------
-- Table structure for doors
-- ----------------------------
DROP TABLE IF EXISTS `doors`;
CREATE TABLE `doors`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `floor_id` int NOT NULL,
  `door_type_id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `status` enum('active','inactive','maintenance') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `lock_status` enum('open','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'closed',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `floor_id`(`floor_id` ASC) USING BTREE,
  INDEX `door_type_id`(`door_type_id` ASC) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  CONSTRAINT `doors_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `doors_ibfk_2` FOREIGN KEY (`door_type_id`) REFERENCES `door_types` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `doors_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of doors
-- ----------------------------
INSERT INTO `doors` VALUES (1, 1, 1, 'Door 1', '', 'active', 'open', '2025-05-03 03:16:23', '2025-05-12 15:48:13', NULL);
INSERT INTO `doors` VALUES (2, 1, 1, 'Door 2', '', 'active', 'closed', '2025-05-03 03:17:54', '2025-05-03 03:17:54', NULL);
INSERT INTO `doors` VALUES (3, 1, 1, 'Door 3', '', 'active', 'closed', '2025-05-10 00:55:52', '2025-05-10 00:55:52', NULL);
INSERT INTO `doors` VALUES (4, 1, 3, 'Door 4', '', 'active', 'closed', '2025-05-10 00:57:00', '2025-05-10 00:57:00', NULL);
INSERT INTO `doors` VALUES (5, 1, 1, 'Door 5', '', 'active', 'closed', '2025-05-10 01:00:22', '2025-05-10 01:00:22', NULL);
INSERT INTO `doors` VALUES (6, 1, 1, 'Door 6', '', 'active', 'closed', '2025-05-10 01:05:47', '2025-05-10 01:05:47', NULL);

-- ----------------------------
-- Table structure for floor_maps
-- ----------------------------
DROP TABLE IF EXISTS `floor_maps`;
CREATE TABLE `floor_maps`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `floor_id` int NOT NULL,
  `map_image_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `width` int NOT NULL,
  `height` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `scale` float NULL DEFAULT 1,
  `is_active` tinyint(1) NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_floor_map`(`floor_id` ASC) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  CONSTRAINT `floor_maps_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `floor_maps_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of floor_maps
-- ----------------------------

-- ----------------------------
-- Table structure for floor_status_history
-- ----------------------------
DROP TABLE IF EXISTS `floor_status_history`;
CREATE TABLE `floor_status_history`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `floor_id` int NOT NULL,
  `previous_status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `new_status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `changed_by` int NULL DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `floor_id`(`floor_id` ASC) USING BTREE,
  INDEX `changed_by`(`changed_by` ASC) USING BTREE,
  CONSTRAINT `floor_status_history_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `floor_status_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of floor_status_history
-- ----------------------------

-- ----------------------------
-- Table structure for floors
-- ----------------------------
DROP TABLE IF EXISTS `floors`;
CREATE TABLE `floors`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `building_id` int NOT NULL,
  `floor_number` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `floor_plan_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_floor_building`(`building_id` ASC, `floor_number` ASC) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  CONSTRAINT `floors_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `floors_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of floors
-- ----------------------------
INSERT INTO `floors` VALUES (1, 1, 1, 'Building 1 Floor', '', '/uploads/floor-plans/floor-plan-1-1-1746242157179-344076982.png', 'active', '2025-05-03 03:15:57', '2025-05-10 00:46:27', NULL);

-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES (1, 'user.view', 'Xem danh sách người dùng', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (2, 'user.create', 'Tạo người dùng mới', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (3, 'user.edit', 'Chỉnh sửa thông tin người dùng', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (4, 'user.delete', 'Xóa người dùng', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (5, 'user.approve', 'Phê duyệt người dùng mới', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (6, 'role.view', 'Xem danh sách vai trò', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (7, 'role.create', 'Tạo vai trò mới', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (8, 'role.edit', 'Chỉnh sửa vai trò', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (9, 'role.delete', 'Xóa vai trò', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (10, 'permission.view', 'Xem danh sách quyền', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (11, 'permission.assign', 'Gán quyền cho vai trò', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (12, 'building.view', 'Xem danh sách tòa nhà', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (13, 'building.create', 'Tạo tòa nhà mới', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (14, 'building.edit', 'Chỉnh sửa thông tin tòa nhà', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (15, 'building.delete', 'Xóa tòa nhà', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (16, 'floor.view', 'Xem danh sách tầng', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (17, 'floor.create', 'Tạo tầng mới', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (18, 'floor.edit', 'Chỉnh sửa thông tin tầng', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (19, 'floor.delete', 'Xóa tầng', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (20, 'floor.map.upload', 'Tải lên sơ đồ tầng', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (21, 'door.view', 'Xem danh sách cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (22, 'door.create', 'Tạo cửa mới', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (23, 'door.edit', 'Chỉnh sửa thông tin cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (24, 'door.delete', 'Xóa cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (25, 'door.coordinate', 'Quản lý tọa độ cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (26, 'doorType.view', 'Xem danh sách loại cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (27, 'doorType.create', 'Tạo loại cửa mới', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (28, 'doorType.edit', 'Chỉnh sửa thông tin loại cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (29, 'doorType.delete', 'Xóa loại cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (30, 'doorCoordinate.view', 'Xem danh sách tọa độ cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (31, 'doorCoordinate.create', 'Tạo tọa độ cửa mới', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (32, 'doorCoordinate.edit', 'Chỉnh sửa thông tin tọa độ cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (33, 'doorCoordinate.delete', 'Xóa tọa độ cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `permissions` VALUES (34, 'building.status', 'Quản lý trạng thái tòa nhà', '2025-05-03 03:15:27', '2025-05-03 03:15:27');
INSERT INTO `permissions` VALUES (35, 'floor.status', 'Quản lý trạng thái tầng', '2025-05-03 03:15:27', '2025-05-03 03:15:27');
INSERT INTO `permissions` VALUES (36, 'door.status', 'Quản lý trạng thái cửa', '2025-05-03 03:15:27', '2025-05-03 03:15:27');
INSERT INTO `permissions` VALUES (37, 'floor.plan.view', 'Xem sơ đồ tầng', '2025-05-03 03:15:27', '2025-05-03 03:15:27');
INSERT INTO `permissions` VALUES (38, 'floor.plan.edit', 'Chỉnh sửa sơ đồ tầng', '2025-05-03 03:15:27', '2025-05-03 03:15:27');
INSERT INTO `permissions` VALUES (39, 'door.lock.view', 'Xem trạng thái khóa cửa', '2025-05-08 01:07:02', '2025-05-08 01:07:02');
INSERT INTO `permissions` VALUES (40, 'door.lock.manage', 'Quản lý trạng thái khóa cửa', '2025-05-08 01:07:02', '2025-05-08 01:07:02');
INSERT INTO `permissions` VALUES (41, 'door.request.view', 'Xem yêu cầu mở cửa', '2025-05-08 01:07:02', '2025-05-08 01:07:02');
INSERT INTO `permissions` VALUES (42, 'door.request.create', 'Tạo yêu cầu mở cửa', '2025-05-08 01:07:02', '2025-05-08 01:07:02');
INSERT INTO `permissions` VALUES (43, 'door.request.approve', 'Phê duyệt/từ chối yêu cầu mở cửa', '2025-05-08 01:07:02', '2025-05-08 01:07:02');

-- ----------------------------
-- Table structure for role_permissions
-- ----------------------------
DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_role_permission`(`role_id` ASC, `permission_id` ASC) USING BTREE,
  INDEX `permission_id`(`permission_id` ASC) USING BTREE,
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 159 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_permissions
-- ----------------------------
INSERT INTO `role_permissions` VALUES (1, 1, 13, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (2, 1, 15, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (3, 1, 14, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (4, 1, 12, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (5, 1, 25, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (6, 1, 22, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (7, 1, 24, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (8, 1, 23, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (9, 1, 21, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (10, 1, 31, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (11, 1, 33, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (12, 1, 32, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (13, 1, 30, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (14, 1, 27, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (15, 1, 29, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (16, 1, 28, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (17, 1, 26, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (18, 1, 17, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (19, 1, 19, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (20, 1, 18, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (21, 1, 20, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (22, 1, 16, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (23, 1, 11, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (24, 1, 10, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (25, 1, 7, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (26, 1, 9, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (27, 1, 8, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (28, 1, 6, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (29, 1, 5, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (30, 1, 2, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (31, 1, 4, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (32, 1, 3, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (33, 1, 1, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (64, 2, 13, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (65, 2, 15, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (66, 2, 14, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (67, 2, 12, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (68, 2, 25, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (69, 2, 22, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (70, 2, 24, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (71, 2, 23, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (72, 2, 21, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (73, 2, 31, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (74, 2, 33, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (75, 2, 32, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (76, 2, 30, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (77, 2, 27, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (78, 2, 29, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (79, 2, 28, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (80, 2, 26, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (81, 2, 17, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (82, 2, 19, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (83, 2, 18, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (84, 2, 20, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (85, 2, 16, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (86, 2, 10, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (87, 2, 7, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (88, 2, 8, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (89, 2, 6, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (90, 2, 5, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (91, 2, 2, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (92, 2, 4, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (93, 2, 3, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (94, 2, 1, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (95, 3, 13, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (96, 3, 14, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (97, 3, 12, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (98, 3, 25, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (99, 3, 22, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (100, 3, 23, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (101, 3, 21, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (102, 3, 17, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (103, 3, 18, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (104, 3, 20, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (105, 3, 16, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (110, 4, 12, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (111, 4, 21, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (112, 4, 16, '2025-05-03 03:15:20');
INSERT INTO `role_permissions` VALUES (113, 1, 34, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (114, 1, 36, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (115, 1, 38, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (116, 1, 37, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (117, 1, 35, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (120, 2, 34, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (121, 2, 36, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (122, 2, 38, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (123, 2, 37, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (124, 2, 35, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (127, 3, 34, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (128, 3, 36, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (129, 3, 38, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (130, 3, 37, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (131, 3, 35, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (134, 4, 37, '2025-05-03 03:15:27');
INSERT INTO `role_permissions` VALUES (135, 1, 40, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (136, 1, 39, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (137, 1, 43, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (138, 1, 42, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (139, 1, 41, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (142, 2, 40, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (143, 2, 39, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (144, 2, 43, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (145, 2, 42, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (146, 2, 41, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (149, 3, 40, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (150, 3, 39, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (151, 3, 43, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (152, 3, 41, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (156, 4, 39, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (157, 4, 42, '2025-05-08 01:07:02');
INSERT INTO `role_permissions` VALUES (158, 4, 41, '2025-05-08 01:07:02');

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, 'super_admin', 'Quyền cao nhất, có thể truy cập và quản lý tất cả các chức năng', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `roles` VALUES (2, 'admin', 'Quản lý hệ thống, có thể quản lý người dùng và phân quyền', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `roles` VALUES (3, 'manager', 'Quản lý tòa nhà, có thể quản lý tòa nhà, tầng và cửa', '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `roles` VALUES (4, 'user', 'Người dùng thông thường, chỉ có thể xem thông tin', '2025-05-03 03:15:20', '2025-05-03 03:15:20');

-- ----------------------------
-- Table structure for user_approval_history
-- ----------------------------
DROP TABLE IF EXISTS `user_approval_history`;
CREATE TABLE `user_approval_history`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `approved_by` int NULL DEFAULT NULL,
  `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'pending',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `approved_by`(`approved_by` ASC) USING BTREE,
  CONSTRAINT `user_approval_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `user_approval_history_ibfk_2` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_approval_history
-- ----------------------------

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `role_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_user_role`(`user_id` ASC, `role_id` ASC) USING BTREE,
  INDEX `role_id`(`role_id` ASC) USING BTREE,
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES (1, 1, 1, '2025-05-03 03:15:20');
INSERT INTO `user_roles` VALUES (2, 2, 4, '2025-05-05 10:10:39');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NULL DEFAULT 0,
  `is_approved` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', 'admin@example.com', '$2b$10$Lp5tdV.myhIuEaxaTWjeguG8NUBoUFWuGJEy1ilPBd/FB3OQsIqpS', 'System Administrator', NULL, 1, 1, '2025-05-03 03:15:20', '2025-05-03 03:15:20');
INSERT INTO `users` VALUES (2, 'hoanglv', 'hoanglv@gmail.com', '$2b$10$f3MBO4HEv1k.gMaNcHuF8ugJyC5cmtOenFDPPrdQBdaMed6iXqEh6', 'hoanglv', NULL, 1, 1, '2025-05-05 10:10:39', '2025-05-05 17:11:09');

-- ----------------------------
-- View structure for building_summary
-- ----------------------------
DROP VIEW IF EXISTS `building_summary`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `building_summary` AS select `b`.`id` AS `building_id`,`b`.`name` AS `building_name`,`b`.`address` AS `address`,`b`.`status` AS `building_status`,count(distinct `f`.`id`) AS `total_floors`,count(distinct `d`.`id`) AS `total_doors`,`b`.`created_at` AS `created_at`,`b`.`updated_at` AS `updated_at`,`u`.`username` AS `created_by_user` from (((`buildings` `b` left join `floors` `f` on((`b`.`id` = `f`.`building_id`))) left join `doors` `d` on((`f`.`id` = `d`.`floor_id`))) left join `users` `u` on((`b`.`created_by` = `u`.`id`))) group by `b`.`id`;

-- ----------------------------
-- View structure for door_detail
-- ----------------------------
DROP VIEW IF EXISTS `door_detail`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `door_detail` AS select `d`.`id` AS `door_id`,`d`.`name` AS `door_name`,`d`.`description` AS `description`,`d`.`status` AS `door_status`,`d`.`lock_status` AS `door_lock_status`,`dt`.`id` AS `door_type_id`,`dt`.`name` AS `door_type`,`f`.`id` AS `floor_id`,`f`.`name` AS `floor_name`,`b`.`id` AS `building_id`,`b`.`name` AS `building_name`,`dc`.`x_coordinate` AS `x_coordinate`,`dc`.`y_coordinate` AS `y_coordinate`,`dc`.`z_coordinate` AS `z_coordinate`,`dc`.`rotation` AS `rotation`,`d`.`created_at` AS `created_at`,`d`.`updated_at` AS `updated_at`,`u`.`username` AS `created_by_user` from (((((`doors` `d` join `door_types` `dt` on((`d`.`door_type_id` = `dt`.`id`))) join `floors` `f` on((`d`.`floor_id` = `f`.`id`))) join `buildings` `b` on((`f`.`building_id` = `b`.`id`))) left join `door_coordinates` `dc` on((`d`.`id` = `dc`.`door_id`))) left join `users` `u` on((`d`.`created_by` = `u`.`id`)));

-- ----------------------------
-- View structure for floor_summary
-- ----------------------------
DROP VIEW IF EXISTS `floor_summary`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `floor_summary` AS select `f`.`id` AS `floor_id`,`f`.`name` AS `floor_name`,`f`.`floor_number` AS `floor_number`,`f`.`status` AS `floor_status`,`b`.`id` AS `building_id`,`b`.`name` AS `building_name`,count(distinct `d`.`id`) AS `total_doors`,`f`.`floor_plan_image` AS `floor_plan_image`,`f`.`created_at` AS `created_at`,`f`.`updated_at` AS `updated_at`,`u`.`username` AS `created_by_user` from (((`floors` `f` join `buildings` `b` on((`f`.`building_id` = `b`.`id`))) left join `doors` `d` on((`f`.`id` = `d`.`floor_id`))) left join `users` `u` on((`f`.`created_by` = `u`.`id`))) group by `f`.`id`;

-- ----------------------------
-- Triggers structure for table buildings
-- ----------------------------
DROP TRIGGER IF EXISTS `building_status_change_trigger`;
delimiter ;;
CREATE TRIGGER `building_status_change_trigger` AFTER UPDATE ON `buildings` FOR EACH ROW BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO building_status_history (building_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.created_by);
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table doors
-- ----------------------------
DROP TRIGGER IF EXISTS `door_status_change_trigger`;
delimiter ;;
CREATE TRIGGER `door_status_change_trigger` AFTER UPDATE ON `doors` FOR EACH ROW BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO door_status_history (door_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.created_by);
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table doors
-- ----------------------------
DROP TRIGGER IF EXISTS `door_lock_status_change_trigger`;
delimiter ;;
CREATE TRIGGER `door_lock_status_change_trigger` AFTER UPDATE ON `doors` FOR EACH ROW BEGIN
    IF OLD.lock_status != NEW.lock_status THEN
        INSERT INTO door_lock_history (door_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.lock_status, NEW.lock_status, NEW.created_by);
END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table floors
-- ----------------------------
DROP TRIGGER IF EXISTS `floor_status_change_trigger`;
delimiter ;;
CREATE TRIGGER `floor_status_change_trigger` AFTER UPDATE ON `floors` FOR EACH ROW BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO floor_status_history (floor_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.created_by);
    END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
