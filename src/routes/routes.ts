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
    BUILDING_FLOORS: "/buildings/:id/floors",
    BUILDING_FLOOR_DETAIL: "/buildings/:id/floors/:floorId",

    // Admin routes
    DASHBOARD: "/dashboard",
    USERS: "/users",
    USER_CREATE: "/users/create",
    USER_EDIT: "/users/:id",
};
