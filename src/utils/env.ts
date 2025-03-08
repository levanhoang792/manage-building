export const ENV = {
    NODE_ENV: import.meta.env.MODE,

    VITE_ENDPOINT_API: import.meta.env.VITE_ENDPOINT_API,
    VITE_IMAGE_MAX_SIZE: import.meta.env.VITE_IMAGE_MAX_SIZE || 10,
    VITE_MODEL_MAX_SIZE: import.meta.env.VITE_MODEL_MAX_SIZE || 100,
}

export const ENV_PRODUCTION = "production";
