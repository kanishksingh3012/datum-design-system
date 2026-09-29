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
      // "charts" is the @datum-design/react/charts subpath: the only entry that imports Recharts.
      entry: { index: resolve(__dirname, "src/index.ts"), charts: resolve(__dirname, "src/charts.ts") },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", /^react-aria(\/|$)/, /^react-stately(\/|$)/, /^@internationalized\/date(\/|$)/, /^recharts(\/|$)/],
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
