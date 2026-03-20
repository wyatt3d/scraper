import { test, expect } from "@playwright/test"

test.describe("Playground (authenticated)", () => {
  test("playground page loads", async ({ page }) => {
    await page.goto("/playground")
    await expect(page.url()).toContain("/playground")
  })

  test("has input area", async ({ page }) => {
    await page.goto("/playground")
    await page.waitForTimeout(2000)
    const input = page.locator("input").first()
    await expect(input).toBeVisible()
  })

  test("has mode toggles", async ({ page }) => {
    await page.goto("/playground")
    await page.waitForTimeout(2000)
    const labels = page.locator("label")
    await expect(labels.first()).toBeVisible()
  })
})
