import { test as setup, expect } from "@playwright/test"

const authFile = "./tests/e2e/.auth/user.json"

setup("authenticate", async ({ page }) => {
  await page.goto("/sign-in")

  await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || "wyatt@taxsaleresources.com")
  await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || "Recons94!")
  await page.click('button[type="submit"]')

  // Wait for redirect to dashboard
  await page.waitForURL(/dashboard|flows|recorder/, { timeout: 15000 })
  await expect(page.url()).not.toContain("/sign-in")

  await page.context().storageState({ path: authFile })
})
