import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // Catch-all: @/ → apps/web/src/
      { find: /^@\//, replacement: path.resolve(__dirname, "../web/src") + "/" },

      // Monorepo packages → source (avoids CJS issues)
      {
        find: "@flight-tracker/utils",
        replacement: path.resolve(__dirname, "../../packages/utils/src/index.ts"),
      },
      {
        find: "@flight-tracker/config",
        replacement: path.resolve(__dirname, "../../packages/config/src/index.ts"),
      },
      {
        find: "@flight-tracker/types",
        replacement: path.resolve(__dirname, "../../packages/types/src/index.ts"),
      },
    ],
  },
  server: {
    port: 3001,
  },
});
