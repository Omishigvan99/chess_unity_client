import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgr from "vite-plugin-svgr";

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '/',
    plugins: [react(), viteTsconfigPaths(),svgr()],
    server: {    
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 8000 
        port: 8000, 
    },
})