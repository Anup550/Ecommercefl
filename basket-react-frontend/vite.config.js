import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server proxies /api/* straight to your Flask backend so you never
// fight CORS while building. Change the target if Flask runs on another port.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
