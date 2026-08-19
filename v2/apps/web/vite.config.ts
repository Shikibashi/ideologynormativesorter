import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  root: fileURLToPath(new URL(".", import.meta.url)),
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@v2/engine-api": fileURLToPath(new URL("../../packages/engine/src/index.ts", import.meta.url)),
      "node:crypto": fileURLToPath(new URL("./src/browser-crypto.ts", import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL("../../dist-v2", import.meta.url)),
    emptyOutDir: true,
    sourcemap: mode === "test",
  },
  server: { port: 4174 },
}));
