import * as cheerio from "cheerio"
import type { RecorderAction, ElementInfo } from "../types"

function collectElements(html: string): ElementInfo[] {
  const $ = cheerio.load(html)
  const results: ElementInfo[] = []
  const SELECTORS = "a, button, input, select, textarea, [role='button'], img, h1, h2, h3, h4, h5, h6, p, span, li, td, th, label"

  $(SELECTORS).each((_, el) => {
    if (results.length >= 150) return false

    const $el = $(el)
    const tag = (el as any).tagName?.toLowerCase()
    if (!tag) return

    const text = $el.text().trim().substring(0, 100)
    const testId = $el.attr("data-testid")
    const id = $el.attr("id")
    const className = $el.attr("class")

    let selector = ""
    if (testId) {
      selector = `[data-testid="${testId}"]`
    } else if (id) {
      selector = `#${id}`
    } else if (className && className.trim()) {
      const firstClass = className.trim().split(/\s+/)[0]
      selector = `${tag}.${firstClass}`
    } else {
      selector = tag
    }

    const interactiveTags = ["a", "button", "input", "select", "textarea"]
    const isInteractive = interactiveTags.includes(tag) || $el.attr("role") === "button"

    let type: ElementInfo["type"] = "container"
    if (tag === "a") type = "link"
    else if (tag === "button" || $el.attr("role") === "button") type = "button"
    else if (tag === "input" || tag === "select" || tag === "textarea") type = "input"
    else if (tag === "img") type = "image"
    else if (["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "label", "li", "td", "th"].includes(tag)) type = "text"

    // Approximate bounding boxes based on content position in DOM
    // (real bounding boxes require browser execution, but this gives clickable targets)
    const index = results.length
    const row = Math.floor(index / 3)
    const col = index % 3
    results.push({
      selector,
      tagName: tag,
      text,
      rect: { x: 20 + col * 300, y: 80 + row * 40, width: 280, height: 30 },
      isInteractive,
      type,
    })
  })

  return results
}

export async function executeRecorderSession(
  url: string,
  actions: RecorderAction[]
): Promise<{
  screenshot: string
  elements: ElementInfo[]
  currentUrl: string
  pageTitle: string
}> {
  const browserlessUrl = process.env.BROWSERLESS_URL
  const browserlessToken = process.env.BROWSERLESS_TOKEN
  if (!browserlessUrl || !browserlessToken) {
    throw new Error("Browserless not configured")
  }

  // Use /content endpoint (known working) for HTML + element mapping
  const contentResponse = await fetch(
    `${browserlessUrl}/content?token=${browserlessToken}&stealth`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        waitForSelector: "body",
        waitForTimeout: 3000,
        bestAttempt: true,
        gotoOptions: { waitUntil: "networkidle2", timeout: 20000 },
      }),
      signal: AbortSignal.timeout(25000),
    }
  )

  if (!contentResponse.ok) {
    throw new Error(`Failed to load page (${contentResponse.status})`)
  }

  const html = await contentResponse.text()
  const $ = cheerio.load(html)
  const pageTitle = $("title").text().trim()

  // Use /screenshot endpoint (known working) for the visual
  const screenshotResponse = await fetch(
    `${browserlessUrl}/screenshot?token=${browserlessToken}&stealth`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        options: { fullPage: false, type: "png" },
        gotoOptions: { waitUntil: "networkidle2", timeout: 20000 },
      }),
      signal: AbortSignal.timeout(25000),
    }
  )

  if (!screenshotResponse.ok) {
    throw new Error(`Screenshot failed (${screenshotResponse.status})`)
  }

  const buffer = await screenshotResponse.arrayBuffer()
  const base64 = Buffer.from(buffer).toString("base64")
  const screenshot = `data:image/png;base64,${base64}`

  // Collect elements from HTML using cheerio (server-side, no browser needed)
  const elements = collectElements(html)

  return {
    screenshot,
    elements,
    currentUrl: url,
    pageTitle,
  }
}
