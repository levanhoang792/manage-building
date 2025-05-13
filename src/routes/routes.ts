export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    LOGOUT: "/logout",
    ACCOUNT_SETTING: "/account-setting",
    FORGOT_PASSWORD: "/forgot-password",
    CONFIRM_OTP: "/confirm-otp",
    CHANGE_PASSWORD: "/change-password",
    SIGN_UP: "/sign-up",

    MODELS: "/models",
    MODELS_CREATE: "/models/create",
    MODELS_DETAIL: "/models/update",

    // Building routes
    BUILDINGS: "/buildings",
    BUILDING_DETAIL: "/buildings/:id",
    BUILDING_CREATE: "/buildings/create",
    BUILDING_EDIT: "/buildings/edit/:id",

    // Floor routes
    BUILDING_FLOORS: "/buildings/:id/floors",
    BUILDING_FLOOR_DETAIL: "/buildings/:id/floors/:floorId",
    BUILDING_FLOOR_CREATE: "/buildings/:id/floors/create",
    BUILDING_FLOOR_EDIT: "/buildings/:id/floors/edit/:floorId",

    // Door routes
    BUILDING_FLOOR_DOORS: "/buildings/:id/floors/:floorId/doors",
    BUILDING_FLOOR_DOOR_DETAIL: "/buildings/:id/floors/:floorId/doors/:doorId",
    BUILDING_FLOOR_DOOR_CREATE: "/buildings/:id/floors/:floorId/doors/create",
    BUILDING_FLOOR_DOOR_EDIT: "/buildings/:id/floors/:floorId/doors/edit/:doorId",

    // Door Coordinate routes
    BUILDING_FLOOR_DOOR_COORDINATES: "/buildings/:id/floors/:floorId/doors/:doorId/coordinates",
    BUILDING_FLOOR_DOOR_COORDINATE_CREATE: "/buildings/:id/floors/:floorId/doors/:doorId/coordinates/create",
    BUILDING_FLOOR_DOOR_COORDINATE_EDIT: "/buildings/:id/floors/:floorId/doors/:doorId/coordinates/edit/:coordinateId",

    // Door Type routes
    DOOR_TYPES: "/door-types",
    DOOR_TYPE_CREATE: "/door-types/create",
    DOOR_TYPE_EDIT: "/door-types/edit/:id",

    // Admin routes
    DASHBOARD: "/dashboard",
    
    // Door Monitoring Dashboard
    DOOR_MONITORING: "/door-monitoring",

    // User management routes
    USERS: "/users",
    USER_CREATE: "/users/create",
    USER_EDIT: "/users/:id",
    USER_DETAIL: "/users/:id",
    USER_PENDING: "/users/pending",

    // Role management routes
    ROLES: "/roles",
    ROLE_CREATE: "/roles/create",
    ROLE_EDIT: "/roles/edit/:id",
    ROLE_DETAIL: "/roles/:id",
    ROLE_PERMISSIONS: "/roles/:id/permissions",

    // Permission management routes
    PERMISSIONS: "/permissions",
    
    // Door Request routes
    DOOR_REQUESTS: "/door-requests",
    DOOR_REQUEST_DETAIL: "/door-requests/:id",
    DOOR_REQUEST_CREATE: "/door-requests/create",
    DOOR_REQUEST_BUILDING_FLOOR_DOOR: "/buildings/:id/floors/:floorId/doors/:doorId/requests",
    
    // Door Lock Management routes
    DOOR_LOCK_MANAGEMENT: "/door-lock-management",
    DOOR_LOCK_BUILDING: "/buildings/:id/door-lock",
    DOOR_LOCK_BUILDING_FLOOR: "/buildings/:id/floors/:floorId/door-lock",
    
    // Door Lock Request routes
    DOOR_LOCK_REQUEST: "/door-lock-request",
    DOOR_LOCK_REQUEST_BUILDING: "/buildings/:id/door-request",
    DOOR_LOCK_REQUEST_BUILDING_FLOOR: "/buildings/:id/floors/:floorId/door-request",
};
