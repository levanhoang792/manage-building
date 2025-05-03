-- Add new permissions for building management
INSERT INTO permissions (name, description) VALUES
('building.view', 'Quyền xem tòa nhà'),
('building.create', 'Quyền tạo tòa nhà mới'),
('building.update', 'Quyền cập nhật tòa nhà'),
('building.delete', 'Quyền xóa tòa nhà');

-- Add new permissions for floor management
INSERT INTO permissions (name, description) VALUES
('floor.view', 'Quyền xem tầng'),
('floor.create', 'Quyền tạo tầng mới'),
('floor.update', 'Quyền cập nhật tầng'),
('floor.delete', 'Quyền xóa tầng');

-- Add new permissions for door management
INSERT INTO permissions (name, description) VALUES
('door.view', 'Quyền xem cửa'),
('door.create', 'Quyền tạo cửa mới'),
('door.update', 'Quyền cập nhật cửa'),
('door.delete', 'Quyền xóa cửa');

-- Add new permissions for door type management
INSERT INTO permissions (name, description) VALUES
                                                ('doorType.view', 'Xem danh sách loại cửa'),
                                                ('doorType.create', 'Tạo loại cửa mới'),
                                                ('doorType.edit', 'Chỉnh sửa thông tin loại cửa'),
                                                ('doorType.delete', 'Xóa loại cửa');

-- Add new permissions for door coordinate management
INSERT INTO permissions (name, description) VALUES
('doorCoordinate.view', 'Quyền xem tọa độ cửa'),
('doorCoordinate.create', 'Quyền tạo tọa độ cửa mới'),
('doorCoordinate.update', 'Quyền cập nhật tọa độ cửa'),
('doorCoordinate.delete', 'Quyền xóa tọa độ cửa');

-- Assign all permissions to super_admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'super_admin'), 
    id 
FROM 
    permissions 
WHERE 
    name IN (
        'building.view', 'building.create', 'building.update', 'building.delete',
        'floor.view', 'floor.create', 'floor.update', 'floor.delete',
        'door.view', 'door.create', 'door.update', 'door.delete',
        'doorType.view', 'doorType.create', 'doorType.update', 'doorType.delete',
        'doorCoordinate.view', 'doorCoordinate.create', 'doorCoordinate.update', 'doorCoordinate.delete'
    );

-- Assign view permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'), 
    id 
FROM 
    permissions 
WHERE 
    name IN (
        'building.view', 'building.create', 'building.update',
        'floor.view', 'floor.create', 'floor.update',
        'door.view', 'door.create', 'door.update',
        'doorType.view', 'doorType.create', 'doorType.update',
        'doorCoordinate.view', 'doorCoordinate.create', 'doorCoordinate.update'
    );

-- Assign view permissions to manager role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'manager'), 
    id 
FROM 
    permissions 
WHERE 
    name IN (
        'building.view',
        'floor.view',
        'door.view',
        'doorType.view',
        'doorCoordinate.view'
    );