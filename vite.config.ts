import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: {
      "@renderer": fileURLToPath(new URL("./src/renderer", import.meta.url)),
      "@modules": fileURLToPath(new URL("./src/modules", import.meta.url))
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});

