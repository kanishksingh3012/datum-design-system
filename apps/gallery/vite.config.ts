import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 5183 },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        check: resolve(__dirname, "check.html"),
        review: resolve(__dirname, "review.html"),
        block: resolve(__dirname, "block.html"),
      },
    },
  },
});
