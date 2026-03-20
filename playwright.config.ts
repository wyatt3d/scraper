import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./tests/e2e/results",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "./tests/e2e/report" }]],
  use: {
    baseURL: "https://scraper.bot",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "public",
      testMatch: /landing|public-pages|seo|api/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "authenticated",
      testMatch: /dashboard|recorder|flows|playground/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./tests/e2e/.auth/user.json",
      },
    },
  ],
})
