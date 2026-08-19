import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./v2/apps/web/tests",
  testMatch: /.*\.pw\.ts/,
  fullyParallel: true,
  timeout: 45_000,
  expect: { timeout: 7_500 },
  reporter: "line",
  snapshotPathTemplate: "{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-platform}{ext}",
  use: {
    baseURL: "http://127.0.0.1:4174",
    locale: "en-US",
    colorScheme: "light",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run v2:web:dev:test -- --host 127.0.0.1 --port 4174 --strictPort",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
