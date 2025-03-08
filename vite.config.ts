import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from "node:path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default ({mode}: { mode: string }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return defineConfig({
        plugins: [react(), svgr()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            proxy: env.VITE_ENDPOINT_API_PROXY_PASS ? {
                '/api': { // Proxy all requests starting with /api
                    target: env.VITE_ENDPOINT_API_PROXY_PASS, // Backend server
                    changeOrigin: true,
                    secure: false, // Set to false if the backend uses self-signed SSL
                    prependPath: false
                    // rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix before sending request
                },
            } : {},
        }
    })
}
