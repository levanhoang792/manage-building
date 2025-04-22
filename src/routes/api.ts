export const API_ROUTES = {
    LOGIN: "/login",
    LOGOUT: "/logout",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    USER_TOKEN: "/user/token",

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

    // Floor endpoints
    FLOORS: "/floors",
    FLOOR_DETAIL: "/floors/:id",
    FLOOR_CREATE: "/floors",
    FLOOR_UPDATE: "/floors/:id",
    FLOOR_DELETE: "/floors/:id",

    // User management endpoints
    USERS: "/users",
    USER_DETAIL: "/users/:id",
    USER_CREATE: "/users",
    USER_UPDATE: "/users/:id",
    USER_DELETE: "/users/:id",

    // Door status endpoints
    DOORS: "/doors",
    DOOR_STATUS: "/doors/:id/status",
    DOOR_TOGGLE: "/doors/:id/toggle",

    // Dashboard statistics
    DASHBOARD_STATS: "/dashboard/stats",
}

export const API_RESPONSE_CODE = {
    SUCCESS: 0,
}
