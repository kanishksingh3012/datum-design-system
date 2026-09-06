import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["src"], rollupTypes: true }),
  ],
  css: {
    modules: {
      // Mirrors Kernel's kernel-[folder]-[local] naming, expressed as a
      // function since Vite's built-in pattern tokens don't include a
      // parent-folder placeholder.
      generateScopedName: (name, filename) => {
        const folder = filename.split("/").slice(-2, -1)[0] ?? "datum";
        return `datum-${folder}-${name}`;
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith(".css") ? "datum.css" : (assetInfo.name ?? "[name][extname]"),
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
