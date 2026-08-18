import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: [
      // App.test historically imported ./data/questions while App uses the reviewed bank.
      {
        find: /^\.\/data\/questions$/,
        replacement: fileURLToPath(
          new URL("./src/data/effectiveQuestions.ts", import.meta.url),
        ),
      },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: [
      ...configDefaults.exclude,
      "tests/browser/**",
      "research-worker/**",
      "tests/compatibility/**/*.test.mjs",
    ],
  },
});
