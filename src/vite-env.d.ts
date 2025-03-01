/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PUBLIC_URL: string
    readonly VITE_ENDPOINT_API: string
    readonly VITE_IMAGE_MAX_SIZE: string
    readonly VITE_MODEL_MAX_SIZE: string
    // more env variables...
}