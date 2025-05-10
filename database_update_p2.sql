-- Cập nhật bảng doors để thêm trạng thái khóa
ALTER TABLE doors
    ADD COLUMN lock_status ENUM('open', 'closed') DEFAULT 'closed' AFTER status;

-- Tạo bảng door_requests để lưu trữ yêu cầu mở cửa
CREATE TABLE door_requests (
                               id INT AUTO_INCREMENT PRIMARY KEY,
                               door_id INT NOT NULL,
                               requester_name VARCHAR(100) NOT NULL,
                               requester_phone VARCHAR(20),
                               requester_email VARCHAR(100),
                               purpose TEXT NOT NULL,
                               status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                               processed_by INT,
                               processed_at TIMESTAMP NULL,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE,
                               FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Tạo bảng door_lock_history để lưu trữ lịch sử đóng/mở khóa
CREATE TABLE door_lock_history (
                                   id INT AUTO_INCREMENT PRIMARY KEY,
                                   door_id INT NOT NULL,
                                   previous_status ENUM('open', 'closed'),
                                   new_status ENUM('open', 'closed'),
                                   changed_by INT,
                                   request_id INT,
                                   reason TEXT,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   FOREIGN KEY (door_id) REFERENCES doors(id) ON DELETE CASCADE,
                                   FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
                                   FOREIGN KEY (request_id) REFERENCES door_requests(id) ON DELETE SET NULL
);

-- Thêm quyền mới liên quan đến quản lý khóa cửa và yêu cầu mở cửa
INSERT INTO permissions (name, description) VALUES
                                                ('door.lock.view', 'Xem trạng thái khóa cửa'),
                                                ('door.lock.manage', 'Quản lý trạng thái khóa cửa'),
                                                ('door.request.view', 'Xem yêu cầu mở cửa'),
                                                ('door.request.create', 'Tạo yêu cầu mở cửa'),
                                                ('door.request.approve', 'Phê duyệt/từ chối yêu cầu mở cửa');

-- Gán quyền mới cho các vai trò
-- Gán quyền cho vai trò Super Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions WHERE name IN ('door.lock.view', 'door.lock.manage', 'door.request.view', 'door.request.create', 'door.request.approve');

-- Gán quyền cho vai trò Admin
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE name IN ('door.lock.view', 'door.lock.manage', 'door.request.view', 'door.request.create', 'door.request.approve');

-- Gán quyền cho vai trò Manager
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE name IN ('door.lock.view', 'door.lock.manage', 'door.request.view', 'door.request.approve');

-- Gán quyền cho vai trò User
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions WHERE name IN ('door.lock.view', 'door.request.view', 'door.request.create');

-- Tạo trigger để tự động ghi lại lịch sử thay đổi trạng thái khóa cửa
DELIMITER //
CREATE TRIGGER door_lock_status_change_trigger
    AFTER UPDATE ON doors
    FOR EACH ROW
BEGIN
    IF OLD.lock_status != NEW.lock_status THEN
        INSERT INTO door_lock_history (door_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.lock_status, NEW.lock_status, NEW.created_by);
END IF;
END //
DELIMITER ;

-- Cập nhật view door_detail để bao gồm trạng thái khóa
CREATE OR REPLACE VIEW door_detail AS
SELECT
    d.id AS door_id,
    d.name AS door_name,
    d.description,
    d.status AS door_status,
    d.lock_status AS door_lock_status,
    dt.id AS door_type_id,
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