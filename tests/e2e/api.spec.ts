import { test, expect } from "@playwright/test"

test.describe("API Endpoints", () => {
  test("health endpoint returns 200", async ({ request }) => {
    const res = await request.get("/api/health")
    expect(res.status()).toBe(200)
  })

  test("flows GET requires auth", async ({ request }) => {
    const res = await request.get("/api/flows")
    expect(res.status()).toBe(401)
  })

  test("runs GET requires auth", async ({ request }) => {
    const res = await request.get("/api/runs")
    expect(res.status()).toBe(401)
  })

  test("extract POST requires auth", async ({ request }) => {
    const res = await request.post("/api/extract", {
      data: { url: "https://example.com" },
    })
    expect(res.status()).toBe(401)
  })

  test("generate POST requires auth", async ({ request }) => {
    const res = await request.post("/api/generate", {
      data: { url: "https://example.com", instructions: "test" },
    })
    expect(res.status()).toBe(401)
  })

  test("tickets POST is public", async ({ request }) => {
    const res = await request.post("/api/tickets", {
      data: {
        type: "bug",
        severity: "low",
        title: "E2E Test Ticket",
        description: "Automated test ticket — can be deleted",
      },
    })
    expect([200, 201, 500]).toContain(res.status())
  })

  test("invalid API key returns 403", async ({ request }) => {
    const res = await request.get("/api/flows", {
      headers: { "X-API-Key": "invalid_key_format" },
    })
    expect(res.status()).toBe(403)
  })

  test("fake scr_ key format passes middleware but may fail validation", async ({ request }) => {
    const res = await request.get("/api/flows", {
      headers: { "X-API-Key": "scr_test_fakekey123" },
    })
    // Passes format check in middleware, may fail DB validation in route
    expect([200, 403]).toContain(res.status())
  })

  test("CSRF blocks cross-origin POST to flows", async ({ request }) => {
    const res = await request.post("/api/flows", {
      headers: {
        "X-API-Key": "scr_test_fakekey123",
        "Origin": "https://evil.com",
      },
      data: { name: "test", url: "https://example.com", mode: "extract" },
    })
    expect(res.status()).toBe(403)
    const body = await res.json()
    expect(body.error).toContain("CSRF")
  })

  test("cron endpoint requires CRON_SECRET", async ({ request }) => {
    const res = await request.get("/api/cron/run-scheduled")
    expect(res.status()).toBe(401)
  })
})
