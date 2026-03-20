import { test, expect } from "@playwright/test"

test.describe("Landing Page", () => {
  test("loads and shows hero", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toContainText("Structured API")
    await expect(page).toHaveTitle(/Scraper/i)
  })

  test("navigation links work", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator('a[href="/docs"]').first()).toBeVisible()
    await expect(page.locator('a[href="/sign-in"]').first()).toBeVisible()
  })

  test("pricing section visible", async ({ page }) => {
    await page.goto("/")
    const pricing = page.locator("#pricing")
    await expect(pricing).toBeVisible()
  })

  test("FAQ accordion works", async ({ page }) => {
    await page.goto("/")
    const faqTrigger = page.locator('[data-state="closed"]').first()
    if (await faqTrigger.isVisible()) {
      await faqTrigger.click()
      await expect(page.locator('[data-state="open"]').first()).toBeVisible()
    }
  })

  test("mobile menu toggle exists", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/")
    await expect(page.locator('button[aria-label="Toggle menu"]')).toBeVisible()
  })
})
