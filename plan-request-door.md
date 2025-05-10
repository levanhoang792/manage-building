# Kế hoạch phát triển chức năng quản lý đóng mở cửa từ xa

## 1. Tổng quan chức năng

Phát triển hệ thống quản lý đóng mở cửa từ xa cho phép:
- Người quản lý có thể kiểm soát việc đóng/mở cửa từ xa
- Khách có thể gửi yêu cầu mở cửa bằng cách chọn tòa nhà, tầng và cửa cụ thể
- Hiển thị trạng thái đóng/mở của cửa trên sơ đồ tầng
- Thông báo realtime khi có yêu cầu mở cửa mới
- Trang quản lý "Yêu cầu mở cửa" để xem và xử lý các yêu cầu

## 2. Cấu trúc dữ liệu

### 2.1. Mô hình dữ liệu hiện có và cần bổ sung

#### Door (Cửa) - Hiện có
```typescript
interface Door {
    id: number;
    floor_id: number;
    door_type_id: number; // Tham chiếu đến bảng door_types
    name: string;
    description?: string;
    status: 'active' | 'inactive' | 'maintenance';
    created_at: string;
    updated_at: string;
    created_by?: number;
}
```

#### Door (Cửa) - Cần bổ sung trạng thái đóng/mở
```typescript
interface Door {
    id: number;
    floor_id: number;
    door_type_id: number; // Tham chiếu đến bảng door_types
    name: string;
    description?: string;
    status: 'active' | 'inactive' | 'maintenance';
    lock_status: 'open' | 'closed'; // Trạng thái đóng/mở khóa cửa
    created_at: string;
    updated_at: string;
    created_by?: number;
}
```

#### DoorType (Loại cửa) - Hiện có
```typescript
interface DoorType {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}
```

#### DoorRequest (Yêu cầu mở cửa) - Cần tạo mới
```typescript
interface DoorRequest {
    id: number;
    door_id: number;
    requester_name: string;
    requester_phone?: string;
    requester_email?: string;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    processed_by?: number; // ID của người xử lý yêu cầu
    processed_at?: string; // Thời gian xử lý yêu cầu
}
```

#### DoorLockHistory (Lịch sử đóng/mở khóa) - Cần tạo mới
```typescript
interface DoorLockHistory {
    id: number;
    door_id: number;
    previous_status: 'open' | 'closed';
    new_status: 'open' | 'closed';
    changed_by: number; // ID của người thay đổi
    request_id?: number; // ID của yêu cầu mở cửa (nếu có)
    reason?: string;
    created_at: string;
}
```

#### Building (Tòa nhà) - Hiện có
```typescript
interface Building {
    id: number;
    name: string;
    address: string;
    description?: string;
    status: 'active' | 'inactive';
    total_floors: number;
    created_at: string;
    updated_at: string;
    created_by?: number;
}
```

#### Floor (Tầng) - Hiện có
```typescript
interface Floor {
    id: number;
    building_id: number;
    floor_number: number;
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    floor_plan_image?: string;
    created_at: string;
    updated_at: string;
    created_by?: number;
}
```

### 2.2. API Endpoints

#### Quản lý cửa (Hiện có và cần mở rộng)
- `GET /api/buildings/{buildingId}/floors/{floorId}/doors` - Lấy danh sách cửa trên một tầng
- `GET /api/buildings/{buildingId}/floors/{floorId}/doors/{id}` - Lấy thông tin chi tiết của một cửa
- `POST /api/buildings/{buildingId}/floors/{floorId}/doors` - Tạo cửa mới
- `PUT /api/buildings/{buildingId}/floors/{floorId}/doors/{id}` - Cập nhật thông tin cửa
- `DELETE /api/buildings/{buildingId}/floors/{floorId}/doors/{id}` - Xóa cửa
- `PUT /api/buildings/{buildingId}/floors/{floorId}/doors/{id}/status` - Cập nhật trạng thái hoạt động của cửa

#### Quản lý khóa cửa (Cần thêm mới)
- `PUT /api/buildings/{buildingId}/floors/{floorId}/doors/{id}/lock` - Cập nhật trạng thái đóng/mở khóa cửa
- `GET /api/buildings/{buildingId}/floors/{floorId}/doors/{id}/lock-history` - Lấy lịch sử đóng/mở khóa cửa

#### Quản lý yêu cầu mở cửa (Cần thêm mới)
- `GET /api/door-requests` - Lấy danh sách tất cả các yêu cầu mở cửa
- `GET /api/door-requests/{id}` - Lấy thông tin chi tiết của một yêu cầu
- `POST /api/door-requests` - Tạo yêu cầu mở cửa mới
- `PUT /api/door-requests/{id}/status` - Cập nhật trạng thái yêu cầu (phê duyệt/từ chối)
- `GET /api/buildings/{buildingId}/floors/{floorId}/doors/{id}/requests` - Lấy danh sách yêu cầu mở cửa cho một cửa cụ thể

#### Quản lý tòa nhà và tầng (Hiện có)
- `GET /api/buildings` - Lấy danh sách tòa nhà
- `GET /api/buildings/{id}/floors` - Lấy danh sách tầng trong tòa nhà

## 3. Giao diện người dùng

### 3.1. Trang quản lý cửa (Mở rộng từ giao diện hiện có)
- Hiển thị danh sách tất cả các cửa với trạng thái hiện tại
- Bổ sung hiển thị trạng thái khóa cửa (đóng/mở)
- Cho phép thêm, sửa, xóa cửa (chức năng hiện có)
- Thêm nút để thay đổi trạng thái đóng/mở khóa của cửa
- Hiển thị lịch sử đóng/mở khóa của cửa

### 3.2. Trang sơ đồ tầng (Mở rộng từ giao diện hiện có)
- Hiển thị sơ đồ tầng với vị trí và trạng thái của các cửa
- Cho phép chọn tòa nhà và tầng để xem (chức năng hiện có)
- Bổ sung hiển thị trạng thái khóa cửa bằng màu sắc khác nhau (ví dụ: xanh - mở, đỏ - đóng)
- Cho phép click vào cửa để xem thông tin chi tiết và thay đổi trạng thái khóa
- Hiển thị thông báo khi có yêu cầu mở cửa mới

### 3.3. Trang yêu cầu mở cửa (cho khách) - Cần phát triển mới
- Form cho phép khách nhập thông tin cá nhân (tên, số điện thoại, email)
- Cho phép chọn tòa nhà, tầng và cửa cần mở từ danh sách có sẵn
- Nhập mục đích yêu cầu mở cửa
- Gửi yêu cầu và hiển thị thông báo xác nhận
- Hiển thị trạng thái yêu cầu (đang chờ, đã phê duyệt, đã từ chối)

### 3.4. Trang quản lý yêu cầu mở cửa (cho người quản lý) - Cần phát triển mới
- Hiển thị danh sách tất cả các yêu cầu mở cửa
- Lọc theo trạng thái (đang chờ, đã phê duyệt, đã từ chối)
- Lọc theo tòa nhà, tầng, cửa
- Cho phép phê duyệt hoặc từ chối yêu cầu
- Khi phê duyệt, tự động mở khóa cửa và ghi lại lịch sử
- Hiển thị thông tin chi tiết của yêu cầu
- Hiển thị thông báo realtime khi có yêu cầu mới

## 4. Thông báo realtime

### 4.1. Công nghệ
- Sử dụng WebSocket hoặc Socket.IO để triển khai thông báo realtime
- Tích hợp với hệ thống hiện có
- Kết nối từ client đến server để nhận thông báo ngay lập tức

### 4.2. Loại thông báo
- Thông báo khi có yêu cầu mở cửa mới
- Thông báo khi trạng thái yêu cầu thay đổi (phê duyệt/từ chối)
- Thông báo khi trạng thái khóa cửa thay đổi (đóng/mở)
- Thông báo khi có người mở cửa (kèm thông tin người mở)

### 4.3. Hiển thị thông báo
- Hiển thị thông báo popup trên giao diện người dùng
- Âm thanh thông báo (tùy chọn)
- Đánh dấu chưa đọc cho các thông báo mới
- Hiển thị số lượng thông báo chưa đọc trên menu
- Trang quản lý thông báo với lịch sử đầy đủ

## 5. Bảo mật

### 5.1. Xác thực và phân quyền (Tận dụng hệ thống hiện có)
- Sử dụng hệ thống xác thực người dùng hiện có
- Bổ sung các quyền mới liên quan đến quản lý khóa cửa và yêu cầu mở cửa:
  - `door.lock.view` - Xem trạng thái khóa cửa
  - `door.lock.manage` - Quản lý trạng thái khóa cửa
  - `door.request.view` - Xem yêu cầu mở cửa
  - `door.request.create` - Tạo yêu cầu mở cửa
  - `door.request.approve` - Phê duyệt/từ chối yêu cầu mở cửa
- Phân quyền rõ ràng giữa người quản lý và khách
- Chỉ người quản lý mới có quyền thay đổi trạng thái khóa cửa và phê duyệt yêu cầu

### 5.2. Ghi nhật ký (Mở rộng từ hệ thống hiện có)
- Tận dụng bảng `activity_logs` hiện có
- Bổ sung ghi lại tất cả các hoạt động liên quan đến việc đóng/mở khóa cửa
- Ghi lại thông tin người thực hiện thay đổi trạng thái khóa
- Lưu trữ lịch sử thay đổi trạng thái khóa cửa và yêu cầu mở cửa
- Tạo báo cáo về lịch sử đóng/mở khóa cửa

## 6. Kế hoạch triển khai

### 6.1. Giai đoạn 1: Cập nhật cơ sở dữ liệu
- Bổ sung trường `lock_status` vào bảng `doors`
- Tạo bảng mới `door_requests` để lưu trữ yêu cầu mở cửa
- Tạo bảng mới `door_lock_history` để lưu trữ lịch sử đóng/mở khóa
- Bổ sung các quyền mới vào bảng `permissions`
- Gán quyền mới cho các vai trò

### 6.2. Giai đoạn 2: Phát triển API
- Phát triển API quản lý khóa cửa
- Phát triển API quản lý yêu cầu mở cửa
- Tích hợp với hệ thống xác thực và phân quyền hiện có
- Thiết lập WebSocket/Socket.IO cho thông báo realtime

### 6.3. Giai đoạn 3: Phát triển giao diện người dùng
- Cập nhật trang quản lý cửa để hiển thị và quản lý trạng thái khóa
- Cập nhật trang sơ đồ tầng để hiển thị trạng thái khóa cửa
- Phát triển trang yêu cầu mở cửa cho khách
- Phát triển trang quản lý yêu cầu mở cửa cho người quản lý
- Tích hợp thông báo realtime vào giao diện người dùng

### 6.4. Giai đoạn 4: Kiểm thử và tối ưu hóa
- Kiểm thử toàn diện các chức năng mới
- Kiểm thử tích hợp với hệ thống hiện có
- Tối ưu hóa hiệu suất
- Sửa lỗi và cải thiện trải nghiệm người dùng
- Đảm bảo tính bảo mật của hệ thống

## 7. Công nghệ đề xuất (Tận dụng công nghệ hiện có)

### 7.1. Frontend
- Tiếp tục sử dụng React/Vite.js như hệ thống hiện tại
- Sử dụng Redux/Context API để quản lý trạng thái
- Socket.IO client cho thông báo realtime
- Tận dụng thư viện hiển thị sơ đồ tầng hiện có và bổ sung hiển thị trạng thái khóa

### 7.2. Backend
- Tiếp tục sử dụng Node.js với Express như hệ thống hiện tại
- Bổ sung Socket.IO server cho thông báo realtime
- Tận dụng hệ thống JWT hiện có cho xác thực
- Tiếp tục sử dụng Sequelize cho tương tác cơ sở dữ liệu

### 7.3. Cơ sở dữ liệu
- Tiếp tục sử dụng MySQL như hệ thống hiện tại
- Bổ sung Redis cho cache và quản lý phiên WebSocket

## 8. Tính năng mở rộng trong tương lai

- Tích hợp với hệ thống kiểm soát vật lý thực tế (hardware) để điều khiển khóa cửa thực tế
- Thêm camera giám sát cho mỗi cửa và hiển thị hình ảnh trực tiếp
- Hệ thống nhận diện khuôn mặt để tự động phê duyệt yêu cầu mở cửa
- Ứng dụng di động cho người quản lý và khách
- Báo cáo và phân tích dữ liệu về việc sử dụng cửa
- Tích hợp với hệ thống báo động khi phát hiện mở cửa trái phép
- Lịch trình tự động đóng/mở cửa theo thời gian
- Tích hợp với hệ thống quản lý nhân viên để kiểm soát quyền truy cập

## 9. Cập nhật cơ sở dữ liệu (Đã thực hiện)

```sql
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
```