import { defineConfig } from "vite";

export default defineConfig({
  // Relative base keeps the built dist/ folder relocatable — you can
  // serve it from any path, not just domain root.
  base: "./",
  build: {
    outDir: "dist"
  }
});
