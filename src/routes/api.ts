export const API_ROUTES = {
    AUTH_LOGIN: "/auth/login",
    AUTH_REFRESH_TOKEN: "/auth/refresh-token",

    LOGOUT: "/logout",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD_EMAIL: "/forgot-password-email",
    FORGOT_PASSWORD_OTP: "/forgot-password-otp",
    FORGOT_PASSWORD_RESET: "/forgot-password-reset",

    // Profile endpoints
    PROFILE_UPDATE: "/profile",
    PROFILE_CHANGE_PASSWORD: "/profile/change-password",

    CONFIG: "/config",

    PRODUCTS: "/products",
    PRODUCTS_DETAIL: "/products/:id",
    PRODUCTS_DELETE: "/products/:id",
    PRODUCTS_UPDATE: "/products/:id",
    PRODUCTS_CHANGE_STATUS: "/products/:id/change-status",

    UPLOAD_TEMP_MODEL: "/upload-temp-model",
    UPLOAD_TEMP_IMAGES: "/upload-temp-images",

    CATEGORIES: "/categories",

    PLATFORMS: "/platforms",

    RENDERS: "/renders",

    COLORS: "/colors",

    MATERIALS: "/materials",

    TAGS: "/tags",

    // Building endpoints
    BUILDINGS: "/buildings",
    BUILDING_DETAIL: "/buildings/:id",
    BUILDING_CREATE: "/buildings",
    BUILDING_UPDATE: "/buildings/:id",
    BUILDING_DELETE: "/buildings/:id",
    BUILDING_STATUS: "/buildings/:id/status",

    // Floor endpoints
    FLOORS: "/buildings/:id/floors",
    FLOOR_DETAIL: "/buildings/:id/floors/:floorId",
    FLOOR_CREATE: "/buildings/:id/floors",
    FLOOR_UPDATE: "/buildings/:id/floors/:floorId",
    FLOOR_DELETE: "/buildings/:id/floors/:floorId",
    FLOOR_STATUS: "/buildings/:id/floors/:floorId/status",
    FLOOR_UPLOAD_PLAN: "/buildings/:id/floors/:floorId/upload-plan",

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

    // User management endpoints
    USERS: "/users",
    USER_DETAIL: "/users/:id",
    USER_CREATE: "/users",
    USER_UPDATE: "/users/:id",
    USER_DELETE: "/users/:id",
    USER_APPROVE: "/users/:id/approve",
    USER_REJECT: "/users/:id/reject",
    USER_PENDING: "/users/pending",

    // Role management endpoints
    ROLES: "/roles",
    ROLE_DETAIL: "/roles/:id",
    ROLE_CREATE: "/roles",
    ROLE_UPDATE: "/roles/:id",
    ROLE_DELETE: "/roles/:id",

    // Permission management endpoints
    PERMISSIONS: "/permissions",
    PERMISSION_DETAIL: "/permissions/:id",

    // Role-Permission management endpoints
    ROLE_PERMISSIONS: "/roles/:id/permissions",
    ROLE_PERMISSION_ASSIGN: "/roles/:id/permissions",
    ROLE_PERMISSION_REMOVE: "/roles/:id/permissions/:permissionId",

    // User-Role management endpoints
    USER_ROLES: "/users/:id/roles",
    USER_ROLE_ASSIGN: "/users/:id/roles",
    USER_ROLE_REMOVE: "/users/:id/roles/:roleId",

    // Door types endpoints
    DOOR_TYPES: "/door-types",
    DOOR_TYPE_DETAIL: "/door-types/:id",
    DOOR_TYPE_CREATE: "/door-types",
    DOOR_TYPE_UPDATE: "/door-types/:id",
    DOOR_TYPE_DELETE: "/door-types/:id",
}

export const API_RESPONSE_CODE = {
    SUCCESS: 200,
}
