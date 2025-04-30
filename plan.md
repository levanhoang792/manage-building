# Kế hoạch xây dựng trang web quản lý tòa nhà

## 1. Tổng quan

Dự án này là một hệ thống quản lý tòa nhà với các chức năng:
- Hệ thống xác thực người dùng (đăng nhập, đăng ký)
- Phân quyền người dùng (Super admin, admin, management, ...)
- Quản lý tòa nhà, tầng và cửa
- Quản lý sơ đồ tầng và tọa độ cửa

## 2. Kiến trúc hệ thống

### Frontend
- React + TypeScript
- Vite làm build tool
- Redux Toolkit để quản lý state
- React Router cho điều hướng
- React Query cho data fetching
- Tailwind CSS cho styling
- React Hook Form + Zod cho form validation

### Backend (cần phát triển)
- RESTful API hoặc GraphQL
- Hệ thống xác thực JWT
- Quản lý phân quyền
- Kết nối cơ sở dữ liệu

### Database
- Cơ sở dữ liệu quan hệ (MySQL/PostgreSQL)
- Các bảng chính: Users, Roles, Permissions, Buildings, Floors, Doors, FloorMaps

## 3. Các chức năng chính

### 3.1. Hệ thống xác thực
- Đăng ký tài khoản
- Đăng nhập
- Quên mật khẩu
- Xác thực 2 yếu tố (tùy chọn)

### 3.2. Quản lý người dùng và phân quyền
- Quản lý danh sách người dùng
- Phê duyệt người dùng mới
- Phân quyền người dùng
- Quản lý vai trò (roles) và quyền hạn (permissions)

### 3.3. Quản lý tòa nhà
- Thêm/sửa/xóa tòa nhà
- Quản lý thông tin tòa nhà (tên, địa chỉ, mô tả, ...)

### 3.4. Quản lý tầng
- Thêm/sửa/xóa tầng trong tòa nhà
- Quản lý thông tin tầng (tên, số tầng, mô tả, ...)
- Tải lên và quản lý sơ đồ tầng

### 3.5. Quản lý cửa
- Thêm/sửa/xóa cửa trên tầng
- Quản lý thông tin cửa (tên, loại, trạng thái, ...)
- Đánh dấu tọa độ cửa trên sơ đồ tầng

## 4. Luồng làm việc

### 4.1. Đăng ký và phê duyệt người dùng
1. Người dùng đăng ký tài khoản
2. Hệ thống gửi thông báo cho admin
3. Admin xem xét và phê duyệt tài khoản
4. Người dùng nhận thông báo và có thể đăng nhập

### 4.2. Quản lý tòa nhà và tầng
1. Admin/Manager tạo tòa nhà mới
2. Thêm các tầng vào tòa nhà
3. Tải lên sơ đồ tầng
4. Thêm và đánh dấu vị trí các cửa trên sơ đồ

## 5. Giao diện người dùng

### 5.1. Trang chính
- Dashboard tổng quan
- Thống kê và biểu đồ

### 5.2. Quản lý người dùng
- Danh sách người dùng
- Form phê duyệt người dùng
- Quản lý vai trò và quyền hạn

### 5.3. Quản lý tòa nhà
- Danh sách tòa nhà
- Chi tiết tòa nhà
- Danh sách tầng trong tòa nhà

### 5.4. Quản lý tầng
- Chi tiết tầng
- Sơ đồ tầng
- Công cụ đánh dấu tọa độ cửa

## 6. Kế hoạch triển khai

### Giai đoạn 1: Thiết lập cơ sở dữ liệu và API
- Thiết kế và tạo schema cơ sở dữ liệu
- Xây dựng API endpoints cơ bản
- Thiết lập hệ thống xác thực

### Giai đoạn 2: Xây dựng giao diện người dùng
- Tạo các components UI cơ bản
- Xây dựng các trang chính
- Tích hợp với API

### Giai đoạn 3: Phát triển chức năng quản lý tòa nhà
- Quản lý tòa nhà
- Quản lý tầng
- Quản lý sơ đồ tầng

### Giai đoạn 4: Phát triển chức năng quản lý cửa
- Quản lý cửa
- Công cụ đánh dấu tọa độ cửa

### Giai đoạn 5: Kiểm thử và tối ưu hóa
- Kiểm thử chức năng
- Tối ưu hóa hiệu suất
- Sửa lỗi

## 7. Công nghệ và thư viện

### Frontend
- React + TypeScript
- Redux Toolkit
- React Router
- React Query
- Tailwind CSS
- React Hook Form + Zod
- Chart.js (cho biểu đồ)

### Backend (đề xuất)
- Node.js + Express hoặc NestJS
- JWT cho xác thực
- TypeORM/Prisma cho ORM
- MySQL/PostgreSQL cho database

## 8. Lưu ý và thách thức

- Bảo mật: Đảm bảo hệ thống phân quyền chặt chẽ
- UX: Thiết kế công cụ đánh dấu tọa độ cửa trực quan và dễ sử dụng
- Hiệu suất: Tối ưu hóa hiển thị sơ đồ tầng với nhiều cửa
- Khả năng mở rộng: Thiết kế hệ thống có thể mở rộng để thêm các chức năng mới trong tương lai