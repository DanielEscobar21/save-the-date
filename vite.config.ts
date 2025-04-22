import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    emptyOutDir: true,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-router-dom",
        "framer-motion",
        "@emotion/styled",
        "@emotion/react",
      ],
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
