# Kế hoạch chỉnh sửa và cập nhật chức năng đăng nhập

## 1. Tổng quan

Dự án hiện tại là một hệ thống quản lý tòa nhà với các chức năng đã được xây dựng một phần. Nhiệm vụ hiện tại là chỉnh sửa màn hình đăng nhập và cập nhật API đăng nhập để hệ thống hoạt động đúng.

## 2. Phân tích hiện trạng

### Frontend
- Đã có sẵn giao diện đăng nhập (`src/pages/login/Login.tsx`)
- Đã có các hook xử lý đăng nhập (`src/hooks/useAuth.ts`, `src/hooks/users/useUsers.ts`)
- Đã có các model định nghĩa dữ liệu (`src/hooks/auth/model.ts`, `src/hooks/users/model.ts`)

### Backend
- Đã có API đăng nhập (`nodejs/src/controllers/auth.controller.js`)
- API hiện tại sử dụng `username` nhưng frontend đang sử dụng `email`

## 3. Kế hoạch thực hiện

### 3.1. Chỉnh sửa Backend API

1. Sửa đổi API đăng nhập để hỗ trợ đăng nhập bằng email:
   - Cập nhật validator trong `nodejs/src/middleware/validators/auth.validator.js`
   - Sửa đổi controller xử lý đăng nhập trong `nodejs/src/controllers/auth.controller.js`
   - Cập nhật model user để hỗ trợ tìm kiếm theo email

### 3.2. Cập nhật Frontend

1. Chỉnh sửa giao diện đăng nhập (`src/pages/login/Login.tsx`):
   - Cập nhật giao diện nếu cần thiết
   - Đảm bảo form đăng nhập gửi đúng định dạng dữ liệu

2. Cập nhật các hook xử lý đăng nhập:
   - Cập nhật `src/hooks/users/useUsers.ts` để đảm bảo gọi API đúng cách
   - Kiểm tra và cập nhật `src/context/AuthProvider.tsx` để xử lý đăng nhập đúng

3. Cập nhật các model nếu cần thiết:
   - Kiểm tra và cập nhật `src/hooks/users/model.ts`
   - Đảm bảo các model phù hợp với API

### 3.3. Kiểm thử

1. Kiểm tra luồng đăng nhập:
   - Đăng nhập với email và mật khẩu hợp lệ
   - Đăng nhập với thông tin không hợp lệ
   - Kiểm tra xử lý lỗi và thông báo

2. Kiểm tra lưu trữ và sử dụng token:
   - Xác minh token được lưu trữ đúng cách
   - Kiểm tra chuyển hướng sau khi đăng nhập thành công

## 4. Chi tiết thực hiện

### 4.1. Sửa đổi Backend API

1. Cập nhật validator trong `nodejs/src/middleware/validators/auth.validator.js`:
   - Thay đổi validation từ `username` sang `email`
   - Đảm bảo validation phù hợp với yêu cầu

2. Sửa đổi controller trong `nodejs/src/controllers/auth.controller.js`:
   - Cập nhật hàm login để hỗ trợ đăng nhập bằng email
   - Điều chỉnh cấu trúc phản hồi để phù hợp với frontend

### 4.2. Cập nhật Frontend

1. Cập nhật `src/hooks/users/useUsers.ts`:
   - Đảm bảo hàm useLogin gửi đúng định dạng dữ liệu
   - Xử lý phản hồi từ API đúng cách

2. Cập nhật `src/context/AuthProvider.tsx`:
   - Đảm bảo xử lý đăng nhập và lưu trữ token đúng cách
   - Cập nhật xử lý lỗi nếu cần

3. Kiểm tra và cập nhật `src/pages/login/Login.tsx`:
   - Đảm bảo form gửi đúng dữ liệu
   - Cập nhật hiển thị thông báo lỗi

## 5. Kết quả mong đợi

1. Người dùng có thể đăng nhập thành công bằng email và mật khẩu
2. Hệ thống xử lý đúng các trường hợp lỗi và hiển thị thông báo phù hợp
3. Sau khi đăng nhập thành công, người dùng được chuyển hướng đến trang chính
4. Token được lưu trữ và sử dụng đúng cách cho các yêu cầu API tiếp theo