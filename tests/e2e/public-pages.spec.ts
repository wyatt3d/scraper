import { test, expect } from "@playwright/test"

test.describe("Public Pages", () => {
  test("docs page loads", async ({ page }) => {
    await page.goto("/docs")
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("pricing page loads", async ({ page }) => {
    await page.goto("/pricing")
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("blog page loads", async ({ page }) => {
    await page.goto("/blog")
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("changelog page loads", async ({ page }) => {
    await page.goto("/changelog")
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("status page loads", async ({ page }) => {
    await page.goto("/status")
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy")
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms")
    await expect(page.locator("h1").first()).toBeVisible()
  })

  test("404 page shows for invalid routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist")
    await expect(page.locator("body")).toContainText(/not found|404/i)
  })

  test("tools page loads", async ({ page }) => {
    await page.goto("/tools")
    await expect(page.locator("h1").first()).toBeVisible()
  })
})

test.describe("Security Headers", () => {
  test("X-Frame-Options is DENY", async ({ request }) => {
    const res = await request.get("/")
    expect(res.headers()["x-frame-options"]).toBe("DENY")
  })

  test("X-Content-Type-Options is nosniff", async ({ request }) => {
    const res = await request.get("/")
    expect(res.headers()["x-content-type-options"]).toBe("nosniff")
  })

  test("Referrer-Policy is set", async ({ request }) => {
    const res = await request.get("/")
    expect(res.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin")
  })

  test("Content-Security-Policy is set", async ({ request }) => {
    const res = await request.get("/")
    expect(res.headers()["content-security-policy"]).toBeTruthy()
  })
})
