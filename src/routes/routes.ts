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

    // Admin routes
    DASHBOARD: "/dashboard",
    USERS: "/users",
    USER_CREATE: "/users/create",
    USER_EDIT: "/users/:id",
};
