import { test, expect } from "@playwright/test"

test.describe("SEO & Meta Tags", () => {
  test("landing page has meta description", async ({ page }) => {
    await page.goto("/")
    const desc = await page.locator('meta[name="description"]').getAttribute("content")
    expect(desc).toBeTruthy()
    expect(desc!.length).toBeGreaterThan(50)
  })

  test("landing page has OG tags", async ({ page }) => {
    await page.goto("/")
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content")
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content")
    expect(ogTitle).toBeTruthy()
    expect(ogDesc).toBeTruthy()
  })

  test("landing page has canonical URL", async ({ page }) => {
    await page.goto("/")
    const canonical = page.locator('link[rel="canonical"]')
    if (await canonical.count() > 0) {
      const href = await canonical.getAttribute("href")
      expect(href).toContain("scraper.bot")
    }
  })

  test("robots.txt exists", async ({ request }) => {
    const res = await request.get("/robots.txt")
    expect(res.status()).toBe(200)
  })

  test("sitemap.xml exists", async ({ request }) => {
    const res = await request.get("/sitemap.xml")
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain("urlset")
  })
})

test.describe("Performance Basics", () => {
  test("landing page loads under 5s", async ({ page }) => {
    const start = Date.now()
    await page.goto("/", { waitUntil: "domcontentloaded" })
    const loadTime = Date.now() - start
    expect(loadTime).toBeLessThan(5000)
  })

  test("sign-in page loads under 3s", async ({ page }) => {
    const start = Date.now()
    await page.goto("/sign-in", { waitUntil: "domcontentloaded" })
    const loadTime = Date.now() - start
    expect(loadTime).toBeLessThan(3000)
  })
})
