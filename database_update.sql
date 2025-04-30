-- Cập nhật cơ sở dữ liệu cho hệ thống quản lý tòa nhà, tầng, cửa và tọa độ
USE building_management;

-- 1. Cập nhật bảng buildings (thêm trường status)
ALTER TABLE buildings
ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active' AFTER description;

-- 2. Cập nhật bảng floors (thêm trường status và floor_plan_image)
ALTER TABLE floors
ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active' AFTER description,
ADD COLUMN floor_plan_image VARCHAR(255) AFTER description;

-- 3. Tạo bảng mới cho tọa độ cửa (tách từ bảng doors)
-- Trước tiên, cần sửa đổi bảng doors để loại bỏ các trường tọa độ
CREATE TABLE door_coordinates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    door_id INT NOT NULL,
    x_coordinate FLOAT NOT NULL,
    y_coordinate FLOAT NOT NULL,
    z_coordinate FLOAT DEFAULT 0,
    rotation FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Di chuyển dữ liệu tọa độ từ bảng doors sang bảng door_coordinates
INSERT INTO door_coordinates (door_id, x_coordinate, y_coordinate, rotation, created_by)
SELECT id, x_coordinate, y_coordinate, rotation, created_by FROM doors;

-- 5. Xóa các trường tọa độ từ bảng doors
ALTER TABLE doors
DROP COLUMN x_coordinate,
DROP COLUMN y_coordinate,
DROP COLUMN width,
DROP COLUMN height,
DROP COLUMN rotation;

-- 6. Cập nhật bảng floor_maps để hỗ trợ tốt hơn cho việc quản lý sơ đồ tầng
ALTER TABLE floor_maps
ADD COLUMN description TEXT AFTER height,
ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER scale;

-- 7. Tạo bảng mới để lưu trữ lịch sử thay đổi trạng thái cửa
CREATE TABLE door_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    door_id INT NOT NULL,
    previous_status ENUM('active', 'inactive', 'maintenance'),
    new_status ENUM('active', 'inactive', 'maintenance'),
    changed_by INT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Tạo bảng mới để lưu trữ lịch sử thay đổi trạng thái tầng
CREATE TABLE floor_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    floor_id INT NOT NULL,
    previous_status ENUM('active', 'inactive'),
    new_status ENUM('active', 'inactive'),
    changed_by INT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Tạo bảng mới để lưu trữ lịch sử thay đổi trạng thái tòa nhà
CREATE TABLE building_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    building_id INT NOT NULL,
    previous_status ENUM('active', 'inactive'),
    new_status ENUM('active', 'inactive'),
    changed_by INT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 10. Thêm quyền mới liên quan đến quản lý trạng thái
INSERT INTO permissions (name, description) VALUES
('building.status', 'Quản lý trạng thái tòa nhà'),
('floor.status', 'Quản lý trạng thái tầng'),
('door.status', 'Quản lý trạng thái cửa'),
('floor.plan.view', 'Xem sơ đồ tầng'),
('floor.plan.edit', 'Chỉnh sửa sơ đồ tầng');

-- 11. Gán quyền mới cho các vai trò
-- Gán quyền mới cho vai trò Super Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions WHERE name IN ('building.status', 'floor.status', 'door.status', 'floor.plan.view', 'floor.plan.edit');

-- Gán quyền mới cho vai trò Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE name IN ('building.status', 'floor.status', 'door.status', 'floor.plan.view', 'floor.plan.edit');

-- Gán quyền mới cho vai trò Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE name IN ('building.status', 'floor.status', 'door.status', 'floor.plan.view', 'floor.plan.edit');

-- Gán quyền mới cho vai trò User
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions WHERE name IN ('floor.plan.view');

-- 12. Tạo trigger để tự động ghi lại lịch sử thay đổi trạng thái cửa
DELIMITER //
CREATE TRIGGER door_status_change_trigger
AFTER UPDATE ON doors
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO door_status_history (door_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.created_by);
    END IF;
END //
DELIMITER ;

-- 13. Tạo trigger để tự động ghi lại lịch sử thay đổi trạng thái tầng
DELIMITER //
CREATE TRIGGER floor_status_change_trigger
AFTER UPDATE ON floors
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO floor_status_history (floor_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.created_by);
    END IF;
END //
DELIMITER ;

-- 14. Tạo trigger để tự động ghi lại lịch sử thay đổi trạng thái tòa nhà
DELIMITER //
CREATE TRIGGER building_status_change_trigger
AFTER UPDATE ON buildings
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO building_status_history (building_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, NEW.created_by);
    END IF;
END //
DELIMITER ;

-- 15. Tạo view để hiển thị thông tin tòa nhà và số lượng tầng, cửa
CREATE OR REPLACE VIEW building_summary AS
SELECT 
    b.id AS building_id,
    b.name AS building_name,
    b.address,
    b.status AS building_status,
    COUNT(DISTINCT f.id) AS total_floors,
    COUNT(DISTINCT d.id) AS total_doors,
    b.created_at,
    b.updated_at,
    u.username AS created_by_user
FROM 
    buildings b
LEFT JOIN 
    floors f ON b.id = f.building_id
LEFT JOIN 
    doors d ON f.id = d.floor_id
LEFT JOIN 
    users u ON b.created_by = u.id
GROUP BY 
    b.id;

-- 16. Tạo view để hiển thị thông tin tầng và số lượng cửa
CREATE OR REPLACE VIEW floor_summary AS
SELECT 
    f.id AS floor_id,
    f.name AS floor_name,
    f.floor_number,
    f.status AS floor_status,
    b.id AS building_id,
    b.name AS building_name,
    COUNT(DISTINCT d.id) AS total_doors,
    f.floor_plan_image,
    f.created_at,
    f.updated_at,
    u.username AS created_by_user
FROM 
    floors f
JOIN 
    buildings b ON f.building_id = b.id
LEFT JOIN 
    doors d ON f.id = d.floor_id
LEFT JOIN 
    users u ON f.created_by = u.id
GROUP BY 
    f.id;

-- 17. Tạo view để hiển thị thông tin cửa và tọa độ
CREATE OR REPLACE VIEW door_detail AS
SELECT 
    d.id AS door_id,
    d.name AS door_name,
    d.description,
    d.status AS door_status,
    dt.name AS door_type,
    f.id AS floor_id,
    f.name AS floor_name,
    b.id AS building_id,
    b.name AS building_name,
    dc.x_coordinate,
    dc.y_coordinate,
    dc.z_coordinate,
    dc.rotation,
    d.created_at,
    d.updated_at,
    u.username AS created_by_user
FROM 
    doors d
JOIN 
    door_types dt ON d.door_type_id = dt.id
JOIN 
    floors f ON d.floor_id = f.id
JOIN 
    buildings b ON f.building_id = b.id
LEFT JOIN 
    door_coordinates dc ON d.id = dc.door_id
LEFT JOIN 
    users u ON d.created_by = u.id;