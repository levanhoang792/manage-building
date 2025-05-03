-- Cơ sở dữ liệu cho hệ thống quản lý tòa nhà

-- Tạo database
CREATE DATABASE IF NOT EXISTS building_management;
USE building_management;

-- Bảng người dùng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng vai trò (roles)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng quyền hạn (permissions)
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng liên kết vai trò và quyền hạn
CREATE TABLE role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Bảng liên kết người dùng và vai trò
CREATE TABLE user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- Bảng tòa nhà
CREATE TABLE buildings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    total_floors INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Bảng tầng
CREATE TABLE floors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    building_id INT NOT NULL,
    floor_number INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_floor_building (building_id, floor_number)
);

-- Bảng sơ đồ tầng
CREATE TABLE floor_maps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    floor_id INT NOT NULL,
    map_image_path VARCHAR(255) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    scale FLOAT DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_floor_map (floor_id)
);

-- Bảng loại cửa
CREATE TABLE door_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng cửa
CREATE TABLE doors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    floor_id INT NOT NULL,
    door_type_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    x_coordinate INT NOT NULL,
    y_coordinate INT NOT NULL,
    width INT DEFAULT 30,
    height INT DEFAULT 30,
    rotation FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE,
    FOREIGN KEY (door_type_id) REFERENCES door_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Bảng lịch sử phê duyệt người dùng
CREATE TABLE user_approval_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    approved_by INT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Bảng lịch sử hoạt động
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Chèn dữ liệu mẫu cho vai trò
INSERT INTO roles (name, description) VALUES
('super_admin', 'Quyền cao nhất, có thể truy cập và quản lý tất cả các chức năng'),
('admin', 'Quản lý hệ thống, có thể quản lý người dùng và phân quyền'),
('manager', 'Quản lý tòa nhà, có thể quản lý tòa nhà, tầng và cửa'),
('user', 'Người dùng thông thường, chỉ có thể xem thông tin');

-- Chèn dữ liệu mẫu cho quyền hạn
INSERT INTO permissions (name, description) VALUES
-- Quyền quản lý người dùng
('user.view', 'Xem danh sách người dùng'),
('user.create', 'Tạo người dùng mới'),
('user.edit', 'Chỉnh sửa thông tin người dùng'),
('user.delete', 'Xóa người dùng'),
('user.approve', 'Phê duyệt người dùng mới'),

-- Quyền quản lý vai trò và phân quyền
('role.view', 'Xem danh sách vai trò'),
('role.create', 'Tạo vai trò mới'),
('role.edit', 'Chỉnh sửa vai trò'),
('role.delete', 'Xóa vai trò'),
('permission.view', 'Xem danh sách quyền'),
('permission.assign', 'Gán quyền cho vai trò'),

-- Quyền quản lý tòa nhà
('building.view', 'Xem danh sách tòa nhà'),
('building.create', 'Tạo tòa nhà mới'),
('building.edit', 'Chỉnh sửa thông tin tòa nhà'),
('building.delete', 'Xóa tòa nhà'),

-- Quyền quản lý tầng
('floor.view', 'Xem danh sách tầng'),
('floor.create', 'Tạo tầng mới'),
('floor.edit', 'Chỉnh sửa thông tin tầng'),
('floor.delete', 'Xóa tầng'),
('floor.map.upload', 'Tải lên sơ đồ tầng'),

-- Quyền quản lý cửa
('door.view', 'Xem danh sách cửa'),
('door.create', 'Tạo cửa mới'),
('door.edit', 'Chỉnh sửa thông tin cửa'),
('door.delete', 'Xóa cửa'),
('door.coordinate', 'Quản lý tọa độ cửa'),

-- Quyền quản lý loại cửa
('doorType.view', 'Xem danh sách loại cửa'),
('doorType.create', 'Tạo loại cửa mới'),
('doorType.edit', 'Chỉnh sửa thông tin loại cửa'),
('doorType.delete', 'Xóa loại cửa'),

-- Quyền quản lý tọa độ cửa
('doorCoordinate.view', 'Xem danh sách tọa độ cửa'),
('doorCoordinate.create', 'Tạo tọa độ cửa mới'),
('doorCoordinate.edit', 'Chỉnh sửa thông tin tọa độ cửa'),
('doorCoordinate.delete', 'Xóa tọa độ cửa');

-- Gán quyền cho vai trò Super Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Gán quyền cho vai trò Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE name NOT IN ('role.delete', 'permission.assign');

-- Gán quyền cho vai trò Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE name IN (
    'building.view', 'building.create', 'building.edit',
    'floor.view', 'floor.create', 'floor.edit', 'floor.map.upload',
    'door.view', 'door.create', 'door.edit', 'door.coordinate'
);

-- Gán quyền cho vai trò User
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions WHERE name IN (
    'building.view', 'floor.view', 'door.view'
);

-- Tạo tài khoản Super Admin mặc định (password: admin123 - cần được mã hóa trong thực tế)
INSERT INTO users (username, email, password, full_name, is_active, is_approved)
VALUES ('admin', 'admin@example.com', '$2b$10$Lp5tdV.myhIuEaxaTWjeguG8NUBoUFWuGJEy1ilPBd/FB3OQsIqpS', 'System Administrator', TRUE, TRUE);

-- Gán vai trò Super Admin cho tài khoản admin
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

-- Chèn dữ liệu mẫu cho loại cửa
INSERT INTO door_types (name, description) VALUES
('normal', 'Cửa thông thường'),
('emergency', 'Cửa thoát hiểm'),
('restricted', 'Cửa hạn chế'),
('elevator', 'Thang máy'),
('stairway', 'Cầu thang');