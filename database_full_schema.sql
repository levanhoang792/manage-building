/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : building_management

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

 Date: 27/05/2025 06:44:08
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
) ENGINE = InnoDB AUTO_INCREMENT = 69 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
INSERT INTO `activity_logs` VALUES (8, 1, 'Created door request', 'door_request', 4, '{\"door_id\":7,\"door_name\":\"Cửa 1\",\"requester_name\":\"sdfsdf\",\"purpose\":\"fsdsdsd\"}', '::1', '2025-05-19 13:20:21');
INSERT INTO `activity_logs` VALUES (9, 1, 'Changed door lock status due to request approval', 'door', 7, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"request_id\":\"4\"}', '::1', '2025-05-19 13:20:27');
INSERT INTO `activity_logs` VALUES (10, 1, 'Approved door request', 'door_request', 4, '{\"requester_name\":\"sdfsdf\",\"door_id\":7,\"door_name\":\"Cửa 1\",\"reason\":null}', '::1', '2025-05-19 13:20:27');
INSERT INTO `activity_logs` VALUES (11, 1, 'Changed door lock status from open to closed', 'door', 7, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-19 14:05:40');
INSERT INTO `activity_logs` VALUES (12, 1, 'Changed door lock status from closed to open', 'door', 7, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-19 14:06:23');
INSERT INTO `activity_logs` VALUES (13, 1, 'Changed door lock status from open to closed', 'door', 7, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-19 14:18:26');
INSERT INTO `activity_logs` VALUES (14, 1, 'Changed door lock status from closed to open', 'door', 7, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-19 14:18:40');
INSERT INTO `activity_logs` VALUES (15, 1, 'Changed door lock status from closed to open', 'door', 9, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-19 14:20:30');
INSERT INTO `activity_logs` VALUES (16, 1, 'Changed door lock status from open to closed', 'door', 9, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-19 14:20:36');
INSERT INTO `activity_logs` VALUES (17, 1, 'Changed door lock status from closed to open', 'door', 9, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-19 14:20:38');
INSERT INTO `activity_logs` VALUES (18, 1, 'Changed door lock status from open to closed', 'door', 9, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-19 14:20:41');
INSERT INTO `activity_logs` VALUES (19, 1, 'Created door request', 'door_request', 5, '{\"door_id\":7,\"door_name\":\"Cửa 1\",\"requester_name\":\"Nguyen A\",\"purpose\":\"ádasdas\"}', '::1', '2025-05-20 04:36:51');
INSERT INTO `activity_logs` VALUES (20, 1, 'Created door request', 'door_request', 6, '{\"door_id\":8,\"door_name\":\"Cửa 2\",\"requester_name\":\"sadas\",\"purpose\":\"ádasd\"}', '::1', '2025-05-20 04:45:05');
INSERT INTO `activity_logs` VALUES (21, NULL, 'Created door request', 'door_request', 7, '{\"door_id\":8,\"door_name\":\"Cửa 2\",\"requester_name\":\"ádasdas\",\"purpose\":\"Yêu cầu mở cửa - Thời gian: 22:21 20/05/2025\"}', '::1', '2025-05-20 15:22:35');
INSERT INTO `activity_logs` VALUES (22, 1, 'Rejected door request', 'door_request', 6, '{\"requester_name\":\"sadas\",\"door_id\":8,\"door_name\":\"Cửa 2\",\"reason\":\"sadasd\"}', '::1', '2025-05-20 15:23:06');
INSERT INTO `activity_logs` VALUES (23, 1, 'Rejected door request', 'door_request', 5, '{\"requester_name\":\"Nguyen A\",\"door_id\":7,\"door_name\":\"Cửa 1\",\"reason\":\"ádasds\"}', '::1', '2025-05-20 15:23:08');
INSERT INTO `activity_logs` VALUES (24, 1, 'Changed door lock status due to request approval', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"request_id\":\"7\"}', '::1', '2025-05-20 18:49:58');
INSERT INTO `activity_logs` VALUES (25, 1, 'Approved door request', 'door_request', 7, '{\"requester_name\":\"ádasdas\",\"door_id\":8,\"door_name\":\"Cửa 2\",\"reason\":null}', '::1', '2025-05-20 18:49:58');
INSERT INTO `activity_logs` VALUES (26, 1, 'Changed door lock status from open to closed', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-20 18:50:26');
INSERT INTO `activity_logs` VALUES (27, NULL, 'Created door request', 'door_request', 8, '{\"door_id\":8,\"door_name\":\"Cửa 2\",\"requester_name\":\"adasd\",\"purpose\":\"Yêu cầu mở cửa - Thời gian: 01:50 21/05/2025\"}', '::1', '2025-05-20 18:50:35');
INSERT INTO `activity_logs` VALUES (28, 1, 'Changed door lock status due to request approval', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"request_id\":\"8\"}', '::1', '2025-05-20 18:50:50');
INSERT INTO `activity_logs` VALUES (29, 1, 'Approved door request', 'door_request', 8, '{\"requester_name\":\"adasd\",\"door_id\":8,\"door_name\":\"Cửa 2\",\"reason\":null}', '::1', '2025-05-20 18:50:50');
INSERT INTO `activity_logs` VALUES (30, 1, 'Changed door lock status from open to closed', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-20 18:51:18');
INSERT INTO `activity_logs` VALUES (31, NULL, 'Created door request', 'door_request', 9, '{\"door_id\":8,\"door_name\":\"Cửa 2\",\"requester_name\":\"asdasd\",\"purpose\":\"Yêu cầu mở cửa - Thời gian: 01:52 21/05/2025\"}', '::1', '2025-05-20 18:52:41');
INSERT INTO `activity_logs` VALUES (32, 1, 'Changed door lock status due to request approval', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"request_id\":\"9\"}', '::1', '2025-05-20 18:57:01');
INSERT INTO `activity_logs` VALUES (33, 1, 'Approved door request', 'door_request', 9, '{\"requester_name\":\"asdasd\",\"door_id\":8,\"door_name\":\"Cửa 2\",\"reason\":\"asdasdd\"}', '::1', '2025-05-20 18:57:01');
INSERT INTO `activity_logs` VALUES (34, 1, 'Changed door lock status from open to closed', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-20 18:59:37');
INSERT INTO `activity_logs` VALUES (35, NULL, 'Created door request', 'door_request', 10, '{\"door_id\":8,\"door_name\":\"Cửa 2\",\"requester_name\":\"cddd\",\"purpose\":\"Yêu cầu mở cửa - Thời gian: 01:59 21/05/2025\"}', '::1', '2025-05-20 18:59:44');
INSERT INTO `activity_logs` VALUES (36, 1, 'Changed door lock status due to request approval', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"request_id\":\"10\"}', '::1', '2025-05-20 18:59:53');
INSERT INTO `activity_logs` VALUES (37, 1, 'Approved door request', 'door_request', 10, '{\"requester_name\":\"cddd\",\"door_id\":8,\"door_name\":\"Cửa 2\",\"reason\":null}', '::1', '2025-05-20 18:59:53');
INSERT INTO `activity_logs` VALUES (38, 1, 'Changed door lock status from open to closed', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-20 19:02:17');
INSERT INTO `activity_logs` VALUES (39, NULL, 'Created door request', 'door_request', 11, '{\"door_id\":8,\"door_name\":\"Cửa 2\",\"requester_name\":\"asdasd\",\"purpose\":\"Yêu cầu mở cửa - Thời gian: 02:04 21/05/2025\"}', '::1', '2025-05-20 19:04:10');
INSERT INTO `activity_logs` VALUES (40, 1, 'Changed door lock status due to request approval', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"request_id\":\"11\"}', '::1', '2025-05-20 19:04:21');
INSERT INTO `activity_logs` VALUES (41, 1, 'Approved door request', 'door_request', 11, '{\"requester_name\":\"asdasd\",\"door_id\":8,\"door_name\":\"Cửa 2\",\"reason\":null}', '::1', '2025-05-20 19:04:21');
INSERT INTO `activity_logs` VALUES (42, 1, 'Changed door lock status from open to closed', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-20 19:04:28');
INSERT INTO `activity_logs` VALUES (43, 1, 'Changed door lock status from closed to open', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-20 19:04:40');
INSERT INTO `activity_logs` VALUES (44, 1, 'Changed door lock status from open to closed', 'door', 8, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-20 19:04:42');
INSERT INTO `activity_logs` VALUES (45, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 01:59:12');
INSERT INTO `activity_logs` VALUES (46, 1, 'Changed door lock status from open to closed', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 01:59:28');
INSERT INTO `activity_logs` VALUES (47, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 01:59:36');
INSERT INTO `activity_logs` VALUES (48, 1, 'Changed door lock status from open to closed', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:02:42');
INSERT INTO `activity_logs` VALUES (49, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:02:46');
INSERT INTO `activity_logs` VALUES (50, 1, 'Changed door lock status from open to closed', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:04:10');
INSERT INTO `activity_logs` VALUES (51, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:04:19');
INSERT INTO `activity_logs` VALUES (52, 1, 'Changed door lock status from open to closed', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:06:19');
INSERT INTO `activity_logs` VALUES (53, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:06:23');
INSERT INTO `activity_logs` VALUES (54, 1, 'Changed door lock status from open to closed', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:06:50');
INSERT INTO `activity_logs` VALUES (55, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:08:49');
INSERT INTO `activity_logs` VALUES (56, 1, 'Changed door lock status from open to closed', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:08:52');
INSERT INTO `activity_logs` VALUES (57, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:09:55');
INSERT INTO `activity_logs` VALUES (58, 1, 'Changed door lock status from open to closed', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:11:01');
INSERT INTO `activity_logs` VALUES (59, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:11:03');
INSERT INTO `activity_logs` VALUES (60, 1, 'Changed door lock status from open to closed', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:11:28');
INSERT INTO `activity_logs` VALUES (61, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:11:38');
INSERT INTO `activity_logs` VALUES (62, 1, 'Changed door lock status from open to closed', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:12:59');
INSERT INTO `activity_logs` VALUES (63, 1, 'Changed door lock status from closed to open', 'door', 14, '{\"door_name\":\"Cửa 1\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 02:13:03');
INSERT INTO `activity_logs` VALUES (64, 1, 'Changed door lock status from closed to open', 'door', 15, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"reason\":\"Door open from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 14:49:43');
INSERT INTO `activity_logs` VALUES (65, 1, 'Changed door lock status from open to closed', 'door', 15, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"open\",\"new_status\":\"closed\",\"reason\":\"Door closed from floor visualizer\",\"request_id\":null}', '::1', '2025-05-21 14:50:39');
INSERT INTO `activity_logs` VALUES (66, NULL, 'Created door request', 'door_request', 12, '{\"door_id\":15,\"door_name\":\"Cửa 2\",\"requester_name\":\"2222\",\"purpose\":\"Yêu cầu mở cửa - Thời gian: 21:52 21/05/2025\"}', '::1', '2025-05-21 14:52:34');
INSERT INTO `activity_logs` VALUES (67, 1, 'Changed door lock status due to request approval', 'door', 15, '{\"door_name\":\"Cửa 2\",\"previous_status\":\"closed\",\"new_status\":\"open\",\"request_id\":\"12\"}', '::1', '2025-05-21 14:53:41');
INSERT INTO `activity_logs` VALUES (68, 1, 'Approved door request', 'door_request', 12, '{\"requester_name\":\"2222\",\"door_id\":15,\"door_name\":\"Cửa 2\",\"reason\":null}', '::1', '2025-05-21 14:53:41');

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of buildings
-- ----------------------------
INSERT INTO `buildings` VALUES (1, 'Building 1', 'Building 1 Address', '', 'active', 1, '2025-05-03 03:15:42', '2025-05-03 03:15:42', NULL);
INSERT INTO `buildings` VALUES (2, 'Building 2', 'Building 2', '', 'active', 1, '2025-05-19 14:02:10', '2025-05-19 14:02:10', NULL);
INSERT INTO `buildings` VALUES (3, 'Building 3', 'Building 3', '', 'active', 1, '2025-05-19 14:02:18', '2025-05-19 14:02:18', NULL);
INSERT INTO `buildings` VALUES (4, 'Building 4', 'Building 4', '', 'active', 1, '2025-05-19 14:02:26', '2025-05-19 14:02:26', NULL);
INSERT INTO `buildings` VALUES (5, 'Building 5', 'Building 5', '', 'active', 1, '2025-05-19 14:02:30', '2025-05-19 14:02:30', NULL);
INSERT INTO `buildings` VALUES (6, 'Building 6', 'Building 6', '', 'active', 1, '2025-05-19 14:02:35', '2025-05-19 14:02:35', NULL);
INSERT INTO `buildings` VALUES (7, 'Building 7', 'Building 7', '', 'active', 1, '2025-05-19 14:02:41', '2025-05-19 14:02:41', NULL);
INSERT INTO `buildings` VALUES (8, 'Building 8', 'Building 8', '', 'active', 1, '2025-05-19 14:36:11', '2025-05-19 14:36:11', NULL);
INSERT INTO `buildings` VALUES (9, 'Building 9', 'Building 9', '', 'active', 1, '2025-05-19 14:36:17', '2025-05-19 14:36:17', NULL);
INSERT INTO `buildings` VALUES (10, 'Building 10', 'Building 10', '', 'active', 1, '2025-05-19 14:36:21', '2025-05-19 14:36:21', NULL);
INSERT INTO `buildings` VALUES (11, 'Building 11', 'Building 11', '', 'active', 1, '2025-05-19 14:36:29', '2025-05-19 14:36:29', NULL);
INSERT INTO `buildings` VALUES (12, 'Building 12', 'Building 12', '', 'active', 1, '2025-05-19 14:36:55', '2025-05-19 14:36:55', NULL);
INSERT INTO `buildings` VALUES (13, 'Building 13', 'Building 13', '', 'active', 1, '2025-05-19 14:36:59', '2025-05-19 14:36:59', NULL);
INSERT INTO `buildings` VALUES (14, 'Building 14', 'Building 14', '', 'active', 1, '2025-05-19 14:37:04', '2025-05-19 14:37:04', NULL);
INSERT INTO `buildings` VALUES (15, 'Building 15', 'Building 15', '', 'active', 1, '2025-05-19 14:37:09', '2025-05-19 14:37:09', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of door_coordinates
-- ----------------------------
INSERT INTO `door_coordinates` VALUES (10, 6, 406.292, 95.2809, 0, 0, '2025-05-10 01:05:47', '2025-05-12 14:38:27', NULL);
INSERT INTO `door_coordinates` VALUES (11, 7, 266.385, 234.253, 0, 0, '2025-05-19 10:25:36', '2025-05-19 10:25:36', NULL);
INSERT INTO `door_coordinates` VALUES (12, 8, 574.23, 236.326, 0, 0, '2025-05-19 10:25:42', '2025-05-19 10:25:42', NULL);
INSERT INTO `door_coordinates` VALUES (13, 9, 379.281, 239.82, 0, 0, '2025-05-19 13:34:40', '2025-05-19 13:34:40', NULL);
INSERT INTO `door_coordinates` VALUES (18, 14, 333.128, 218.048, 0, 0, '2025-05-21 01:58:48', '2025-05-21 01:58:48', NULL);
INSERT INTO `door_coordinates` VALUES (19, 15, 570.212, 382.881, 0, 0, '2025-05-21 02:13:21', '2025-05-21 02:13:21', NULL);
INSERT INTO `door_coordinates` VALUES (20, 16, 138.203, 368.254, 0, 0, '2025-05-21 02:39:59', '2025-05-21 02:39:59', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 89 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of door_lock_history
-- ----------------------------
INSERT INTO `door_lock_history` VALUES (3, 7, 'closed', 'open', NULL, NULL, NULL, '2025-05-19 13:20:27');
INSERT INTO `door_lock_history` VALUES (4, 7, 'closed', 'open', 1, 4, 'Approved door request from sdfsdf', '2025-05-19 13:20:27');
INSERT INTO `door_lock_history` VALUES (5, 7, 'open', 'closed', NULL, NULL, NULL, '2025-05-19 14:05:40');
INSERT INTO `door_lock_history` VALUES (6, 7, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-19 14:05:40');
INSERT INTO `door_lock_history` VALUES (7, 7, 'closed', 'open', NULL, NULL, NULL, '2025-05-19 14:06:23');
INSERT INTO `door_lock_history` VALUES (8, 7, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-19 14:06:23');
INSERT INTO `door_lock_history` VALUES (9, 7, 'open', 'closed', NULL, NULL, NULL, '2025-05-19 14:18:26');
INSERT INTO `door_lock_history` VALUES (10, 7, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-19 14:18:26');
INSERT INTO `door_lock_history` VALUES (11, 7, 'closed', 'open', NULL, NULL, NULL, '2025-05-19 14:18:40');
INSERT INTO `door_lock_history` VALUES (12, 7, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-19 14:18:40');
INSERT INTO `door_lock_history` VALUES (13, 9, 'closed', 'open', NULL, NULL, NULL, '2025-05-19 14:20:30');
INSERT INTO `door_lock_history` VALUES (14, 9, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-19 14:20:30');
INSERT INTO `door_lock_history` VALUES (15, 9, 'open', 'closed', NULL, NULL, NULL, '2025-05-19 14:20:36');
INSERT INTO `door_lock_history` VALUES (16, 9, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-19 14:20:36');
INSERT INTO `door_lock_history` VALUES (17, 9, 'closed', 'open', NULL, NULL, NULL, '2025-05-19 14:20:38');
INSERT INTO `door_lock_history` VALUES (18, 9, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-19 14:20:38');
INSERT INTO `door_lock_history` VALUES (19, 9, 'open', 'closed', NULL, NULL, NULL, '2025-05-19 14:20:41');
INSERT INTO `door_lock_history` VALUES (20, 9, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-19 14:20:41');
INSERT INTO `door_lock_history` VALUES (21, 8, 'closed', 'open', NULL, NULL, NULL, '2025-05-20 18:49:57');
INSERT INTO `door_lock_history` VALUES (22, 8, 'closed', 'open', 1, 7, 'Approved door request from ádasdas', '2025-05-20 18:49:58');
INSERT INTO `door_lock_history` VALUES (23, 8, 'open', 'closed', NULL, NULL, NULL, '2025-05-20 18:50:26');
INSERT INTO `door_lock_history` VALUES (24, 8, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-20 18:50:26');
INSERT INTO `door_lock_history` VALUES (25, 8, 'closed', 'open', NULL, NULL, NULL, '2025-05-20 18:50:50');
INSERT INTO `door_lock_history` VALUES (26, 8, 'closed', 'open', 1, 8, 'Approved door request from adasd', '2025-05-20 18:50:50');
INSERT INTO `door_lock_history` VALUES (27, 8, 'open', 'closed', NULL, NULL, NULL, '2025-05-20 18:51:18');
INSERT INTO `door_lock_history` VALUES (28, 8, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-20 18:51:18');
INSERT INTO `door_lock_history` VALUES (29, 8, 'closed', 'open', NULL, NULL, NULL, '2025-05-20 18:57:01');
INSERT INTO `door_lock_history` VALUES (30, 8, 'closed', 'open', 1, 9, 'Approved door request from asdasd', '2025-05-20 18:57:01');
INSERT INTO `door_lock_history` VALUES (31, 8, 'open', 'closed', NULL, NULL, NULL, '2025-05-20 18:59:37');
INSERT INTO `door_lock_history` VALUES (32, 8, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-20 18:59:37');
INSERT INTO `door_lock_history` VALUES (33, 8, 'closed', 'open', NULL, NULL, NULL, '2025-05-20 18:59:53');
INSERT INTO `door_lock_history` VALUES (34, 8, 'closed', 'open', 1, 10, 'Approved door request from cddd', '2025-05-20 18:59:53');
INSERT INTO `door_lock_history` VALUES (35, 8, 'open', 'closed', NULL, NULL, NULL, '2025-05-20 19:02:17');
INSERT INTO `door_lock_history` VALUES (36, 8, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-20 19:02:17');
INSERT INTO `door_lock_history` VALUES (37, 8, 'closed', 'open', NULL, NULL, NULL, '2025-05-20 19:04:21');
INSERT INTO `door_lock_history` VALUES (38, 8, 'closed', 'open', 1, 11, 'Approved door request from asdasd', '2025-05-20 19:04:21');
INSERT INTO `door_lock_history` VALUES (39, 8, 'open', 'closed', NULL, NULL, NULL, '2025-05-20 19:04:28');
INSERT INTO `door_lock_history` VALUES (40, 8, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-20 19:04:28');
INSERT INTO `door_lock_history` VALUES (41, 8, 'closed', 'open', NULL, NULL, NULL, '2025-05-20 19:04:40');
INSERT INTO `door_lock_history` VALUES (42, 8, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-20 19:04:40');
INSERT INTO `door_lock_history` VALUES (43, 8, 'open', 'closed', NULL, NULL, NULL, '2025-05-20 19:04:42');
INSERT INTO `door_lock_history` VALUES (44, 8, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-20 19:04:42');
INSERT INTO `door_lock_history` VALUES (45, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 01:59:12');
INSERT INTO `door_lock_history` VALUES (46, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 01:59:12');
INSERT INTO `door_lock_history` VALUES (47, 14, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 01:59:28');
INSERT INTO `door_lock_history` VALUES (48, 14, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 01:59:28');
INSERT INTO `door_lock_history` VALUES (49, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 01:59:36');
INSERT INTO `door_lock_history` VALUES (50, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 01:59:36');
INSERT INTO `door_lock_history` VALUES (51, 14, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 02:02:41');
INSERT INTO `door_lock_history` VALUES (52, 14, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 02:02:41');
INSERT INTO `door_lock_history` VALUES (53, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 02:02:46');
INSERT INTO `door_lock_history` VALUES (54, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 02:02:46');
INSERT INTO `door_lock_history` VALUES (55, 14, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 02:04:09');
INSERT INTO `door_lock_history` VALUES (56, 14, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 02:04:09');
INSERT INTO `door_lock_history` VALUES (57, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 02:04:18');
INSERT INTO `door_lock_history` VALUES (58, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 02:04:18');
INSERT INTO `door_lock_history` VALUES (59, 14, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 02:06:18');
INSERT INTO `door_lock_history` VALUES (60, 14, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 02:06:18');
INSERT INTO `door_lock_history` VALUES (61, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 02:06:23');
INSERT INTO `door_lock_history` VALUES (62, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 02:06:23');
INSERT INTO `door_lock_history` VALUES (63, 14, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 02:06:49');
INSERT INTO `door_lock_history` VALUES (64, 14, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 02:06:49');
INSERT INTO `door_lock_history` VALUES (65, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 02:08:47');
INSERT INTO `door_lock_history` VALUES (66, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 02:08:47');
INSERT INTO `door_lock_history` VALUES (67, 14, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 02:08:51');
INSERT INTO `door_lock_history` VALUES (68, 14, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 02:08:51');
INSERT INTO `door_lock_history` VALUES (69, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 02:09:54');
INSERT INTO `door_lock_history` VALUES (70, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 02:09:54');
INSERT INTO `door_lock_history` VALUES (71, 14, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 02:10:59');
INSERT INTO `door_lock_history` VALUES (72, 14, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 02:10:59');
INSERT INTO `door_lock_history` VALUES (73, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 02:11:03');
INSERT INTO `door_lock_history` VALUES (74, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 02:11:03');
INSERT INTO `door_lock_history` VALUES (75, 14, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 02:11:27');
INSERT INTO `door_lock_history` VALUES (76, 14, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 02:11:27');
INSERT INTO `door_lock_history` VALUES (77, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 02:11:37');
INSERT INTO `door_lock_history` VALUES (78, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 02:11:37');
INSERT INTO `door_lock_history` VALUES (79, 14, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 02:12:58');
INSERT INTO `door_lock_history` VALUES (80, 14, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 02:12:58');
INSERT INTO `door_lock_history` VALUES (81, 14, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 02:13:02');
INSERT INTO `door_lock_history` VALUES (82, 14, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 02:13:02');
INSERT INTO `door_lock_history` VALUES (83, 15, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 14:49:42');
INSERT INTO `door_lock_history` VALUES (84, 15, 'closed', 'open', 1, NULL, 'Door open from floor visualizer', '2025-05-21 14:49:42');
INSERT INTO `door_lock_history` VALUES (85, 15, 'open', 'closed', NULL, NULL, NULL, '2025-05-21 14:50:37');
INSERT INTO `door_lock_history` VALUES (86, 15, 'open', 'closed', 1, NULL, 'Door closed from floor visualizer', '2025-05-21 14:50:37');
INSERT INTO `door_lock_history` VALUES (87, 15, 'closed', 'open', NULL, NULL, NULL, '2025-05-21 14:53:41');
INSERT INTO `door_lock_history` VALUES (88, 15, 'closed', 'open', 1, 12, 'Approved door request from 2222', '2025-05-21 14:53:41');

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
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of door_requests
-- ----------------------------
INSERT INTO `door_requests` VALUES (1, 6, 'ádadas', '0292331222', 'hoanglv@stringee.com', 'ấccsacs', 'rejected', 1, '2025-05-12 15:49:44', NULL, '2025-05-12 15:21:09', '2025-05-12 15:49:44');
INSERT INTO `door_requests` VALUES (4, 7, 'sdfsdf', '4225435', 'fsdfsdfsd@gmail.com', 'fsdsdsd', 'approved', 1, '2025-05-19 13:20:27', NULL, '2025-05-19 13:20:21', '2025-05-19 13:20:27');
INSERT INTO `door_requests` VALUES (5, 7, 'Nguyen A', '011129219', 'hoanglv@stringee.com', 'ádasdas', 'rejected', 1, '2025-05-20 15:23:08', 'ádasds', '2025-05-20 04:36:51', '2025-05-20 15:23:08');
INSERT INTO `door_requests` VALUES (6, 8, 'sadas', '3423423', 'dd@gmail.com', 'ádasd', 'rejected', 1, '2025-05-20 15:23:05', 'sadasd', '2025-05-20 04:45:05', '2025-05-20 15:23:05');
INSERT INTO `door_requests` VALUES (7, 8, 'ádasdas', '3423423', NULL, 'Yêu cầu mở cửa - Thời gian: 22:21 20/05/2025', 'approved', 1, '2025-05-20 18:49:57', NULL, '2025-05-20 15:22:35', '2025-05-20 18:49:57');
INSERT INTO `door_requests` VALUES (8, 8, 'adasd', '342342', NULL, 'Yêu cầu mở cửa - Thời gian: 01:50 21/05/2025', 'approved', 1, '2025-05-20 18:50:50', NULL, '2025-05-20 18:50:35', '2025-05-20 18:50:50');
INSERT INTO `door_requests` VALUES (9, 8, 'asdasd', 'asdas', NULL, 'Yêu cầu mở cửa - Thời gian: 01:52 21/05/2025', 'approved', 1, '2025-05-20 18:57:01', 'asdasdd', '2025-05-20 18:52:41', '2025-05-20 18:57:01');
INSERT INTO `door_requests` VALUES (10, 8, 'cddd', '333', NULL, 'Yêu cầu mở cửa - Thời gian: 01:59 21/05/2025', 'approved', 1, '2025-05-20 18:59:53', NULL, '2025-05-20 18:59:44', '2025-05-20 18:59:53');
INSERT INTO `door_requests` VALUES (11, 8, 'asdasd', 'asd', NULL, 'Yêu cầu mở cửa - Thời gian: 02:04 21/05/2025', 'approved', 1, '2025-05-20 19:04:21', NULL, '2025-05-20 19:04:10', '2025-05-20 19:04:21');
INSERT INTO `door_requests` VALUES (12, 15, '2222', '3232', NULL, 'Yêu cầu mở cửa - Thời gian: 21:52 21/05/2025', 'approved', 1, '2025-05-21 14:53:41', NULL, '2025-05-21 14:52:34', '2025-05-21 14:53:41');

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of door_status_history
-- ----------------------------
INSERT INTO `door_status_history` VALUES (3, 16, 'active', 'inactive', NULL, NULL, '2025-05-21 02:40:28');
INSERT INTO `door_status_history` VALUES (4, 15, 'active', 'inactive', NULL, NULL, '2025-05-21 14:47:15');
INSERT INTO `door_status_history` VALUES (5, 15, 'inactive', 'active', NULL, NULL, '2025-05-21 14:47:27');

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
  `thingsboard_device_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `thingsboard_access_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `floor_id`(`floor_id` ASC) USING BTREE,
  INDEX `door_type_id`(`door_type_id` ASC) USING BTREE,
  INDEX `created_by`(`created_by` ASC) USING BTREE,
  INDEX `idx_thingsboard_device_id`(`thingsboard_device_id` ASC) USING BTREE,
  CONSTRAINT `doors_ibfk_1` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `doors_ibfk_2` FOREIGN KEY (`door_type_id`) REFERENCES `door_types` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `doors_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of doors
-- ----------------------------
INSERT INTO `doors` VALUES (6, 1, 1, 'Door 6', '', 'active', 'closed', NULL, NULL, '2025-05-10 01:05:47', '2025-05-10 01:05:47', NULL);
INSERT INTO `doors` VALUES (7, 2, 1, 'Cửa 1', '', 'active', 'open', NULL, NULL, '2025-05-19 10:25:36', '2025-05-19 14:18:40', NULL);
INSERT INTO `doors` VALUES (8, 2, 1, 'Cửa 2', '', 'active', 'closed', NULL, NULL, '2025-05-19 10:25:42', '2025-05-20 19:04:42', NULL);
INSERT INTO `doors` VALUES (9, 1, 1, 'Cửa 1', '', 'active', 'closed', NULL, NULL, '2025-05-19 13:34:40', '2025-05-19 14:20:41', NULL);
INSERT INTO `doors` VALUES (14, 3, 1, 'Cửa 1', '', 'active', 'open', '22bd6380-35e7-11f0-810f-0b16c84a1d4e', '0c6TDSiGH8lpPRsAzsuu', '2025-05-21 01:58:47', '2025-05-21 02:13:02', NULL);
INSERT INTO `doors` VALUES (15, 3, 1, 'Cửa 2', '', 'active', 'open', '2ac65b20-35e9-11f0-b363-51263a22eb97', '1DjGdYyjOZ0YQMLqPII4', '2025-05-21 02:13:20', '2025-05-21 14:53:41', NULL);
INSERT INTO `doors` VALUES (16, 3, 1, 'Door 3', '', 'inactive', 'closed', 'e2d5c5e0-35ec-11f0-858a-67efd1bc8a87', 'aDMgwlBFAPVTmO7Mg9UA', '2025-05-21 02:39:57', '2025-05-21 02:40:28', NULL);

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of floor_status_history
-- ----------------------------
INSERT INTO `floor_status_history` VALUES (1, 3, 'active', 'inactive', NULL, NULL, '2025-05-21 02:40:07');
INSERT INTO `floor_status_history` VALUES (2, 3, 'inactive', 'active', NULL, NULL, '2025-05-21 02:40:17');

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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of floors
-- ----------------------------
INSERT INTO `floors` VALUES (1, 1, 1, 'Building 1 Floor', '', '/uploads/floor-plans/floor-plan-1-1-1747650392385-552647627.png', 'active', '2025-05-03 03:15:57', '2025-05-19 10:26:33', NULL);
INSERT INTO `floors` VALUES (2, 1, 2, 'Floor 2', '', '/uploads/floor-plans/floor-plan-1-2-1747650325537-160690535.png', 'active', '2025-05-19 10:25:26', '2025-05-19 10:25:26', NULL);
INSERT INTO `floors` VALUES (3, 15, 1, 'Floor 1', '', '/uploads/floor-plans/floor-plan-15-3-1747768887324-221339406.png', 'active', '2025-05-20 19:21:28', '2025-05-21 02:40:17', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 175 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of role_permissions
-- ----------------------------
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
INSERT INTO `role_permissions` VALUES (159, 1, 12, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (160, 1, 13, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (161, 1, 14, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (162, 1, 15, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (163, 1, 34, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (164, 1, 21, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (165, 1, 22, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (166, 1, 23, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (167, 1, 24, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (168, 1, 25, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (169, 1, 36, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (170, 1, 39, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (171, 1, 40, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (172, 1, 41, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (173, 1, 42, '2025-05-21 14:43:16');
INSERT INTO `role_permissions` VALUES (174, 1, 43, '2025-05-21 14:43:16');

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
-- Event structure for auto_cancel_door_requests
-- ----------------------------
DROP EVENT IF EXISTS `auto_cancel_door_requests`;
delimiter ;;
CREATE EVENT `auto_cancel_door_requests`
ON SCHEDULE
EVERY '1' MINUTE STARTS '2025-05-21 14:01:09'
DO UPDATE door_requests 
  SET 
    status = 'rejected',
    reason = 'Automatically rejected due to no confirmation within 5 minutes',
    processed_at = CURRENT_TIMESTAMP
  WHERE 
    status = 'pending' 
    AND created_at < DATE_SUB(NOW(), INTERVAL 5 MINUTE)
;;
delimiter ;

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
