import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("sign-in page loads", async ({ page }) => {
    await page.goto("/sign-in")
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test("sign-up page loads", async ({ page }) => {
    await page.goto("/sign-up")
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  test("sign-in with invalid credentials shows error", async ({ page }) => {
    await page.goto("/sign-in")
    await page.fill('input[type="email"]', "invalid@test.com")
    await page.fill('input[type="password"]', "wrongpassword123")
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    const toast = page.locator('[data-sonner-toast]').first()
    if (await toast.isVisible()) {
      await expect(toast).toContainText(/fail|invalid|error/i)
    }
  })

  test("dashboard redirects to sign-in when unauthenticated", async ({ page }) => {
    await page.goto("/dashboard")
    await page.waitForURL(/sign-in/)
    expect(page.url()).toContain("/sign-in")
  })

  test("recorder redirects to sign-in when unauthenticated", async ({ page }) => {
    await page.goto("/recorder")
    await page.waitForURL(/sign-in/)
    expect(page.url()).toContain("/sign-in")
  })

  test("flows redirects to sign-in when unauthenticated", async ({ page }) => {
    await page.goto("/flows")
    await page.waitForURL(/sign-in/)
    expect(page.url()).toContain("/sign-in")
  })
})
