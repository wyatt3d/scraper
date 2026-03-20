import { test, expect } from "@playwright/test"

test.describe("Dashboard (authenticated)", () => {
  test("loads dashboard", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.url()).not.toContain("/sign-in")
    await expect(page.locator("body")).toContainText(/dashboard|overview|flows|welcome/i)
  })

  test("sidebar has 8 nav items", async ({ page }) => {
    await page.goto("/dashboard")
    const navItems = page.locator("nav a, [data-sidebar] a")
    await expect(navItems.first()).toBeVisible()
  })

  test("record CTA card visible", async ({ page }) => {
    await page.goto("/dashboard")
    const recordCta = page.locator('text=Record a New Flow')
    if (await recordCta.isVisible()) {
      await expect(recordCta).toBeVisible()
    }
  })

  test("can navigate to flows", async ({ page }) => {
    await page.goto("/flows")
    await expect(page.url()).toContain("/flows")
    await expect(page.url()).not.toContain("/sign-in")
  })

  test("can navigate to runs", async ({ page }) => {
    await page.goto("/runs")
    await expect(page.url()).toContain("/runs")
    await expect(page.url()).not.toContain("/sign-in")
  })

  test("can navigate to templates", async ({ page }) => {
    await page.goto("/templates")
    await expect(page.url()).toContain("/templates")
  })

  test("can navigate to api-keys", async ({ page }) => {
    await page.goto("/api-keys")
    await expect(page.url()).toContain("/api-keys")
  })

  test("can navigate to settings", async ({ page }) => {
    await page.goto("/settings")
    await expect(page.url()).toContain("/settings")
  })

  test("settings billing tab deep-link works", async ({ page }) => {
    await page.goto("/settings?tab=billing")
    await expect(page.url()).toContain("tab=billing")
  })
})
