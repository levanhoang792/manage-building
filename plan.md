# Kế hoạch phát triển chức năng quản lý tòa nhà, tầng, cửa và tọa độ

## 1. Tổng quan

Phát triển mới hoàn toàn chức năng quản lý tòa nhà bao gồm:
- Quản lý tòa nhà (cần phát triển mới)
- Quản lý tầng (cần phát triển mới)
- Quản lý cửa trong tầng (cần phát triển mới)
- Quản lý tọa độ các cửa trong tầng (cần phát triển mới)

## 2. Cấu trúc dữ liệu

### 2.1. Mô hình dữ liệu

```
Building (Tòa nhà)
├── id
├── name
├── address
├── description
├── created_at
├── updated_at
└── status (active, inactive)

Floor (Tầng)
├── id
├── building_id (FK to Building)
├── name/number
├── description
├── floor_plan_image (URL hoặc path đến hình ảnh sơ đồ tầng)
├── created_at
├── updated_at
└── status (active, inactive)

Door (Cửa)
├── id
├── floor_id (FK to Floor)
├── name
├── description
├── type (loại cửa: main, emergency, service, etc.)
├── status (active, inactive, maintenance)
├── created_at
└── updated_at

DoorCoordinate (Tọa độ cửa)
├── id
├── door_id (FK to Door)
├── x_coordinate
├── y_coordinate
├── z_coordinate (nếu cần)
├── rotation (góc quay của cửa, nếu cần)
├── created_at
└── updated_at
```

### 2.2. API Endpoints

```
# Quản lý tòa nhà (cần phát triển mới)
GET /api/buildings                  # Lấy danh sách tòa nhà (có phân trang, lọc)
POST /api/buildings                 # Tạo mới tòa nhà
GET /api/buildings/:id              # Lấy chi tiết tòa nhà
PUT /api/buildings/:id              # Cập nhật thông tin tòa nhà
DELETE /api/buildings/:id           # Xóa tòa nhà
PATCH /api/buildings/:id/status     # Cập nhật trạng thái tòa nhà

# Quản lý tầng (cần phát triển mới)
GET /api/buildings/:buildingId/floors                # Lấy danh sách tầng của tòa nhà
POST /api/buildings/:buildingId/floors               # Tạo mới tầng trong tòa nhà
GET /api/buildings/:buildingId/floors/:id            # Lấy chi tiết tầng
PUT /api/buildings/:buildingId/floors/:id            # Cập nhật thông tin tầng
DELETE /api/buildings/:buildingId/floors/:id         # Xóa tầng
PATCH /api/buildings/:buildingId/floors/:id/status   # Cập nhật trạng thái tầng
POST /api/buildings/:buildingId/floors/:id/upload-plan # Upload sơ đồ tầng

# Quản lý cửa (cần phát triển mới)
GET /api/buildings/:buildingId/floors/:floorId/doors                # Lấy danh sách cửa trong tầng
POST /api/buildings/:buildingId/floors/:floorId/doors               # Tạo mới cửa trong tầng
GET /api/buildings/:buildingId/floors/:floorId/doors/:id            # Lấy chi tiết cửa
PUT /api/buildings/:buildingId/floors/:floorId/doors/:id            # Cập nhật thông tin cửa
DELETE /api/buildings/:buildingId/floors/:floorId/doors/:id         # Xóa cửa
PATCH /api/buildings/:buildingId/floors/:floorId/doors/:id/status   # Cập nhật trạng thái cửa

# Quản lý tọa độ cửa (cần phát triển mới)
GET /api/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates      # Lấy tọa độ của cửa
POST /api/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates     # Tạo mới tọa độ cho cửa
PUT /api/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id  # Cập nhật tọa độ cửa
DELETE /api/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id # Xóa tọa độ cửa
```

## 3. Cấu trúc thư mục và file

### 3.1. Frontend

```
src/
├── pages/
│   ├── building/                      (cần phát triển mới)
│   │   ├── BuildingManagement.tsx     (cần phát triển mới)
│   │   ├── BuildingDetail.tsx         (cần phát triển mới)
│   │   └── components/                (cần phát triển mới)
│   │       ├── BuildingForm.tsx
│   │       ├── BuildingList.tsx
│   │       ├── BuildingItem.tsx
│   │       └── BuildingFilter.tsx
│   │
│   ├── floor/                         (cần phát triển mới)
│   │   ├── FloorManagement.tsx        (cần phát triển mới)
│   │   ├── FloorDetail.tsx            (cần phát triển mới)
│   │   └── components/                (cần phát triển mới)
│   │       ├── FloorForm.tsx
│   │       ├── FloorList.tsx
│   │       ├── FloorItem.tsx
│   │       ├── FloorFilter.tsx
│   │       └── FloorPlanUploader.tsx
│   │
│   └── door/                          (cần phát triển mới)
│       ├── DoorManagement.tsx         (cần phát triển mới)
│       ├── DoorDetail.tsx             (cần phát triển mới)
│       └── components/                (cần phát triển mới)
│           ├── DoorForm.tsx
│           ├── DoorList.tsx
│           ├── DoorItem.tsx
│           ├── DoorFilter.tsx
│           ├── DoorCoordinateForm.tsx
│           └── CoordinateVisualizer.tsx   (component để hiển thị vị trí cửa)
│
├── components/                        (components dùng chung)
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   │
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── hooks/
│   ├── buildings/                     (cần phát triển mới)
│   │   ├── useBuildings.ts            (cần phát triển mới)
│   │   ├── model.ts                   (cần phát triển mới - định nghĩa các types)
│   │   └── index.ts                   (cần phát triển mới - export các hooks)
│   │
│   ├── floors/                        (cần phát triển mới)
│   │   ├── useFloors.ts               (cần phát triển mới)
│   │   ├── model.ts                   (cần phát triển mới - định nghĩa các types)
│   │   └── index.ts                   (cần phát triển mới - export các hooks)
│   │
│   ├── doors/                         (cần phát triển mới)
│   │   ├── useDoors.ts                (cần phát triển mới)
│   │   ├── model.ts                   (cần phát triển mới - định nghĩa các types)
│   │   └── index.ts                   (cần phát triển mới - export các hooks)
│   │
│   └── doorCoordinates/               (cần phát triển mới)
│       ├── useDoorCoordinates.ts      (cần phát triển mới)
│       ├── model.ts                   (cần phát triển mới - định nghĩa các types)
│       └── index.ts                   (cần phát triển mới - export các hooks)
│
├── store/
│   ├── slices/
│   │   ├── buildingSlice.ts           (cần phát triển mới)
│   │   ├── floorSlice.ts              (cần phát triển mới)
│   │   ├── doorSlice.ts               (cần phát triển mới)
│   │   └── doorCoordinateSlice.ts     (cần phát triển mới)
│
└── routes/
    └── routes.ts                      (cần cập nhật với routes mới)
```

### 3.2. Backend (cần phát triển mới)

```
nodejs/
├── src/
│   ├── controllers/
│   │   ├── buildingController.js      (cần phát triển mới)
│   │   ├── floorController.js         (cần phát triển mới)
│   │   ├── doorController.js          (cần phát triển mới)
│   │   └── doorCoordinateController.js (cần phát triển mới)
│   │
│   ├── models/
│   │   ├── Building.js                (cần phát triển mới)
│   │   ├── Floor.js                   (cần phát triển mới)
│   │   ├── Door.js                    (cần phát triển mới)
│   │   └── DoorCoordinate.js          (cần phát triển mới)
│   │
│   ├── routes/
│   │   ├── buildingRoutes.js          (cần phát triển mới)
│   │   ├── floorRoutes.js             (cần phát triển mới)
│   │   ├── doorRoutes.js              (cần phát triển mới)
│   │   └── doorCoordinateRoutes.js    (cần phát triển mới)
│   │
│   ├── services/
│   │   ├── buildingService.js         (cần phát triển mới)
│   │   ├── floorService.js            (cần phát triển mới)
│   │   ├── doorService.js             (cần phát triển mới)
│   │   └── doorCoordinateService.js   (cần phát triển mới)
│   │
│   ├── middlewares/
│   │   ├── auth.js                    (xác thực người dùng)
│   │   ├── validation.js              (validate dữ liệu đầu vào)
│   │   ├── errorHandler.js            (xử lý lỗi)
│   │   └── upload.js                  (xử lý upload file)
│   │
│   ├── utils/
│   │   ├── database.js                (kết nối database)
│   │   ├── logger.js                  (ghi log)
│   │   └── response.js                (format response)
│   │
│   └── config/
│       ├── database.js                (cấu hình database)
│       ├── app.js                     (cấu hình ứng dụng)
│       └── storage.js                 (cấu hình lưu trữ file)
```

## 4. Các tính năng cần phát triển

### 4.1. Quản lý tòa nhà

1. **Danh sách tòa nhà**
   - Hiển thị danh sách tòa nhà với thông tin cơ bản
   - Tìm kiếm, lọc tòa nhà theo tên, địa chỉ, trạng thái
   - Phân trang và sắp xếp

2. **Thêm tòa nhà mới**
   - Form thêm tòa nhà với các thông tin: tên, địa chỉ, mô tả, trạng thái
   - Validation dữ liệu
   - Upload hình ảnh tòa nhà (nếu cần)

3. **Chỉnh sửa tòa nhà**
   - Form chỉnh sửa thông tin tòa nhà
   - Validation dữ liệu
   - Cập nhật hình ảnh tòa nhà (nếu cần)

4. **Xóa tòa nhà**
   - Xác nhận trước khi xóa
   - Xử lý các ràng buộc với tầng, cửa

5. **Quản lý trạng thái tòa nhà**
   - Kích hoạt/vô hiệu hóa tòa nhà

### 4.2. Quản lý tầng

1. **Danh sách tầng**
   - Hiển thị danh sách tầng trong một tòa nhà
   - Tìm kiếm, lọc tầng theo tên, trạng thái
   - Phân trang và sắp xếp

2. **Thêm tầng mới**
   - Form thêm tầng với các thông tin: tên/số tầng, mô tả, trạng thái
   - Upload sơ đồ tầng
   - Validation dữ liệu

3. **Chỉnh sửa tầng**
   - Form chỉnh sửa thông tin tầng
   - Cập nhật sơ đồ tầng
   - Validation dữ liệu

4. **Xóa tầng**
   - Xác nhận trước khi xóa
   - Xử lý các ràng buộc với cửa

5. **Quản lý trạng thái tầng**
   - Kích hoạt/vô hiệu hóa tầng

### 4.3. Quản lý cửa

1. **Danh sách cửa**
   - Hiển thị danh sách cửa trong một tầng
   - Tìm kiếm, lọc cửa theo tên, loại, trạng thái
   - Phân trang và sắp xếp

2. **Thêm cửa mới**
   - Form thêm cửa với các thông tin: tên, mô tả, loại cửa, trạng thái
   - Validation dữ liệu

3. **Chỉnh sửa cửa**
   - Form chỉnh sửa thông tin cửa
   - Validation dữ liệu

4. **Xóa cửa**
   - Xác nhận trước khi xóa
   - Xử lý các ràng buộc với tọa độ

5. **Quản lý trạng thái cửa**
   - Kích hoạt/vô hiệu hóa/bảo trì cửa

### 4.4. Quản lý tọa độ cửa

1. **Hiển thị tọa độ**
   - Hiển thị tọa độ của cửa
   - Visualizer để hiển thị vị trí cửa trên sơ đồ tầng

2. **Thêm/Chỉnh sửa tọa độ**
   - Form nhập tọa độ x, y, z
   - Hoặc chọn vị trí trên sơ đồ tầng
   - Điều chỉnh góc quay của cửa (nếu cần)
   - Validation dữ liệu

3. **Xóa tọa độ**
   - Xác nhận trước khi xóa

### 4.5. Tích hợp với sơ đồ tầng

1. **Hiển thị sơ đồ tầng**
   - Hiển thị sơ đồ tầng với vị trí các cửa
   - Zoom in/out, pan
   - Chế độ xem khác nhau (2D, 3D nếu có thể)

2. **Tương tác với sơ đồ**
   - Chọn cửa trên sơ đồ để xem/chỉnh sửa thông tin
   - Kéo thả để điều chỉnh vị trí cửa
   - Xoay cửa để điều chỉnh góc

## 5. Kế hoạch phát triển API

### 5.1. Cập nhật API Routes

1. **Thêm API Routes mới**
   - Cập nhật file `src/routes/api.ts` với các endpoints mới
   - Đảm bảo tuân thủ cấu trúc đặt tên hiện tại
   - Thêm các endpoints cho tòa nhà, tầng, cửa và tọa độ cửa

2. **Ví dụ cập nhật API Routes**
   ```typescript
   // Thêm vào file src/routes/api.ts
   
   // Building endpoints
   BUILDINGS: "/buildings",
   BUILDING_DETAIL: "/buildings/:id",
   BUILDING_CREATE: "/buildings",
   BUILDING_UPDATE: "/buildings/:id",
   BUILDING_DELETE: "/buildings/:id",
   BUILDING_STATUS: "/buildings/:id/status",
   
   // Floor endpoints
   FLOORS: "/buildings/:buildingId/floors",
   FLOOR_DETAIL: "/buildings/:buildingId/floors/:id",
   FLOOR_CREATE: "/buildings/:buildingId/floors",
   FLOOR_UPDATE: "/buildings/:buildingId/floors/:id",
   FLOOR_DELETE: "/buildings/:buildingId/floors/:id",
   FLOOR_STATUS: "/buildings/:buildingId/floors/:id/status",
   FLOOR_UPLOAD_PLAN: "/buildings/:buildingId/floors/:id/upload-plan",
   
   // Door endpoints
   DOORS: "/buildings/:buildingId/floors/:floorId/doors",
   DOOR_DETAIL: "/buildings/:buildingId/floors/:floorId/doors/:id",
   DOOR_CREATE: "/buildings/:buildingId/floors/:floorId/doors",
   DOOR_UPDATE: "/buildings/:buildingId/floors/:floorId/doors/:id",
   DOOR_DELETE: "/buildings/:buildingId/floors/:floorId/doors/:id",
   DOOR_STATUS: "/buildings/:buildingId/floors/:floorId/doors/:id/status",
   
   // Door Coordinate endpoints
   DOOR_COORDINATES: "/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates",
   DOOR_COORDINATE_DETAIL: "/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id",
   DOOR_COORDINATE_CREATE: "/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates",
   DOOR_COORDINATE_UPDATE: "/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id",
   DOOR_COORDINATE_DELETE: "/buildings/:buildingId/floors/:floorId/doors/:doorId/coordinates/:id",
   ```

### 5.2. Phát triển Hooks API

1. **Phát triển hooks cho tòa nhà**
   - Tạo các hooks trong `src/hooks/buildings/`
   - Định nghĩa các types trong `model.ts`
   - Phát triển các hooks như `useGetBuildings`, `useCreateBuilding`, `useUpdateBuilding`, v.v.

2. **Phát triển hooks cho tầng**
   - Tạo các hooks trong `src/hooks/floors/`
   - Định nghĩa các types trong `model.ts`
   - Phát triển các hooks như `useGetFloors`, `useCreateFloor`, `useUpdateFloor`, v.v.

3. **Phát triển hooks cho cửa**
   - Tạo các hooks trong `src/hooks/doors/`
   - Định nghĩa các types trong `model.ts`
   - Phát triển các hooks như `useGetDoors`, `useCreateDoor`, `useUpdateDoor`, v.v.

4. **Phát triển hooks cho tọa độ cửa**
   - Tạo các hooks trong `src/hooks/doorCoordinates/`
   - Định nghĩa các types trong `model.ts`
   - Phát triển các hooks như `useGetDoorCoordinates`, `useCreateDoorCoordinate`, `useUpdateDoorCoordinate`, v.v.

### 5.3. Ví dụ cấu trúc hook

```typescript
// src/hooks/buildings/useBuildings.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpGet, httpPost, httpPut, httpDelete } from "@/utils/api";
import { API_ROUTES } from "@/routes/api";
import { Building, ReqCreateBuilding, ReqUpdateBuilding } from "./model";
import { ResRequest } from "@/hooks/model";

const queryKey = "buildings";

// Hook để lấy danh sách tòa nhà
export const useGetBuildings = (params?: any) => {
  return useQuery({
    queryKey: [queryKey, JSON.stringify(params)],
    queryFn: async () => {
      const resp = await httpGet({
        uri: API_ROUTES.BUILDINGS,
        options: params ? { body: JSON.stringify(params) } : undefined
      });
      return await resp.json() as ResRequest<Building[]>;
    }
  });
};

// Hook để lấy chi tiết tòa nhà
export const useGetBuildingDetail = (id: string) => {
  return useQuery({
    queryKey: [queryKey, id],
    queryFn: async () => {
      const resp = await httpGet({
        uri: API_ROUTES.BUILDING_DETAIL.replace(":id", id)
      });
      return await resp.json() as ResRequest<Building>;
    },
    enabled: !!id // Chỉ gọi API khi có id
  });
};

// Hook để tạo tòa nhà mới
export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: ReqCreateBuilding) => {
      const resp = await httpPost({
        uri: API_ROUTES.BUILDING_CREATE,
        options: { body: JSON.stringify(params) }
      });
      return await resp.json() as ResRequest<Building>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  });
};

// Hook để cập nhật tòa nhà
export const useUpdateBuilding = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: ReqUpdateBuilding) => {
      const resp = await httpPut({
        uri: API_ROUTES.BUILDING_UPDATE.replace(":id", id),
        options: { body: JSON.stringify(params) }
      });
      return await resp.json() as ResRequest<Building>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, id] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  });
};

// Hook để xóa tòa nhà
export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const resp = await httpDelete({
        uri: API_ROUTES.BUILDING_DELETE.replace(":id", id)
      });
      return await resp.json() as ResRequest<null>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  });
};

// Hook để cập nhật trạng thái tòa nhà
export const useUpdateBuildingStatus = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: 'active' | 'inactive') => {
      const resp = await httpPost({
        uri: API_ROUTES.BUILDING_STATUS.replace(":id", id),
        options: { body: JSON.stringify({ status }) }
      });
      return await resp.json() as ResRequest<Building>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey, id] });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    }
  });
};
```

### 5.4. Phát triển Backend API

1. **Cấu trúc dự án**
   - Thiết lập cấu trúc dự án Node.js/Express
   - Cấu hình middleware, routes, controllers, services

2. **Kết nối database**
   - Thiết lập kết nối database
   - Tạo models và migrations

3. **Phát triển API endpoints**
   - Phát triển API cho quản lý tòa nhà
   - Phát triển API cho quản lý tầng
   - Phát triển API cho quản lý cửa
   - Phát triển API cho quản lý tọa độ cửa

4. **Validation và xử lý lỗi**
   - Validation dữ liệu đầu vào
   - Xử lý lỗi và trả về response phù hợp

5. **Upload và lưu trữ file**
   - Xử lý upload sơ đồ tầng
   - Lưu trữ và phục vụ file tĩnh

### 5.5. Testing API

1. **Unit testing**
   - Test các functions, services

2. **Integration testing**
   - Test API endpoints
   - Test luồng dữ liệu

3. **Performance testing**
   - Test hiệu năng API
   - Tối ưu hóa nếu cần

## 6. Kế hoạch triển khai

### 6.1. Giai đoạn 1: Chuẩn bị

1. Thiết kế database schema
2. Thiết kế API endpoints
3. Thiết kế UI/UX
4. Cấu hình môi trường phát triển

### 6.2. Giai đoạn 2: Phát triển Backend

1. Phát triển database models
2. Phát triển API endpoints
3. Phát triển middleware và utils
4. Testing API

### 6.3. Giai đoạn 3: Phát triển Frontend

1. Phát triển quản lý tòa nhà
   - Tạo components và services
   - Phát triển trang BuildingManagement và BuildingDetail

2. Phát triển quản lý tầng
   - Tạo components và services
   - Phát triển trang FloorManagement và FloorDetail

3. Phát triển quản lý cửa
   - Tạo components và services
   - Phát triển trang DoorManagement và DoorDetail

4. Phát triển quản lý tọa độ cửa
   - Tạo components và services
   - Phát triển component CoordinateVisualizer

### 6.4. Giai đoạn 4: Tích hợp và Kiểm thử

1. Tích hợp Frontend và Backend
2. Kiểm thử end-to-end
3. Sửa lỗi và tối ưu hóa
4. Hoàn thiện UI/UX

### 6.5. Giai đoạn 5: Triển khai

1. Chuẩn bị môi trường production
2. Triển khai ứng dụng
3. Monitoring và bảo trì

## 7. Công nghệ sử dụng

### 7.1. Frontend
- **Framework**: React
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **API Client**: Axios, React Query
- **UI Components**: Material-UI hoặc Ant Design
- **Form Handling**: Formik, Yup
- **Visualization**: Canvas/SVG, Three.js (nếu cần 3D)

### 7.2. Backend
- **Framework**: Node.js, Express
- **Database**: MySQL/PostgreSQL
- **ORM**: Sequelize/Prisma
- **Authentication**: JWT
- **Validation**: Joi/Yup
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer
- **Logging**: Winston

### 7.3. DevOps
- **Version Control**: Git
- **CI/CD**: GitHub Actions/Jenkins
- **Containerization**: Docker
- **Testing**: Jest, Supertest