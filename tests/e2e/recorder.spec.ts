import { test, expect } from "@playwright/test"

test.describe("Recorder (authenticated)", () => {
  test("recorder page loads", async ({ page }) => {
    await page.goto("/recorder")
    await expect(page.url()).toContain("/recorder")
    await expect(page.locator("text=Record a Flow")).toBeVisible()
  })

  test("has URL input and Go button", async ({ page }) => {
    await page.goto("/recorder")
    await expect(page.locator('input[placeholder*="https"]')).toBeVisible()
    await expect(page.locator('button:has-text("Go")')).toBeVisible()
  })

  test("has mode toolbar", async ({ page }) => {
    await page.goto("/recorder")
    await expect(page.locator('button:has-text("Select")')).toBeVisible()
    await expect(page.locator('button:has-text("Click")')).toBeVisible()
    await expect(page.locator('button:has-text("Fill")')).toBeVisible()
    await expect(page.locator('button:has-text("Extract")')).toBeVisible()
    await expect(page.locator('button:has-text("Scroll")')).toBeVisible()
  })

  test("has save flow button and name input", async ({ page }) => {
    await page.goto("/recorder")
    await expect(page.locator('input[placeholder*="Flow name"]')).toBeVisible()
    await expect(page.locator('button:has-text("Save Flow")')).toBeVisible()
  })

  test("recorded steps panel visible", async ({ page }) => {
    await page.goto("/recorder")
    await expect(page.locator("text=Recorded Steps")).toBeVisible()
  })

  test("save flow button is disabled with no steps", async ({ page }) => {
    await page.goto("/recorder")
    const saveBtn = page.locator('button:has-text("Save Flow")')
    await expect(saveBtn).toBeVisible()
    await expect(saveBtn).toBeDisabled()
  })
})
