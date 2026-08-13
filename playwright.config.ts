import { defineConfig, devices } from "@playwright/test";

const port = 4173;

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "line",
  timeout: 45_000,
  expect: { timeout: 7_500 },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://127.0.0.1:${port}`,
    locale: "en-US",
    colorScheme: "light",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      VITE_RESEARCH_ENDPOINT: "/__e2e/research",
    },
  },
  projects: [
    { name: "e2e", testMatch: /e2e\/.*\.spec\.ts/ },
    { name: "a11y", testMatch: /a11y\/.*\.spec\.ts/ },
    { name: "ecw", testMatch: /ecw\/.*\.spec\.ts/ },
  ],
});
