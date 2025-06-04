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

 Date: 04/06/2025 22:01:40
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
) ENGINE = InnoDB AUTO_INCREMENT = 247 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 227 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 78 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
-- Event structure for auto_close_doors_event
-- ----------------------------
DROP EVENT IF EXISTS `auto_close_doors_event`;
delimiter ;;
CREATE EVENT `auto_close_doors_event`
ON SCHEDULE
EVERY '1' MINUTE STARTS '2025-06-04 14:38:23'
DO BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE v_door_id INT;
  DECLARE v_request_id INT;
  DECLARE cur CURSOR FOR
    SELECT d.id, dr.id
    FROM doors d
    JOIN (
      SELECT dr1.*
      FROM door_requests dr1
      JOIN (
        SELECT door_id, MAX(created_at) AS latest_time
        FROM door_requests
        GROUP BY door_id
      ) latest ON dr1.door_id = latest.door_id AND dr1.created_at = latest.latest_time
    ) dr ON dr.door_id = d.id
    WHERE d.lock_status = 'open'
      AND TIMESTAMPDIFF(MINUTE, dr.created_at, NOW()) > 10;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO v_door_id, v_request_id;
    IF done THEN
      LEAVE read_loop;
    END IF;

    -- Ghi log trước khi cập nhật
    INSERT INTO door_lock_history (
      door_id, previous_status, new_status, changed_by, request_id, reason
    ) VALUES (
      v_door_id, 'open', 'closed', NULL, v_request_id, 'Auto-closed after 10 minutes'
    );

    -- Cập nhật trạng thái cửa
    UPDATE doors
    SET lock_status = 'closed'
    WHERE id = v_door_id;
  END LOOP;
  CLOSE cur;
END
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
