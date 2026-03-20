const express = require("express")
const cors = require("cors")
const fetch = require("node-fetch")

const app = express()
const PORT = 3001
const BROWSERLESS_URL = "http://localhost:3000"
const BROWSERLESS_TOKEN = "scr_playwright_secret_key"
const API_SECRET = process.env.RECORDER_API_SECRET || "scr_recorder_secret_2026"

app.use(cors({ origin: ["https://scraper.bot", "http://localhost:3000", "http://localhost:3001"] }))
app.use(express.json({ limit: "10mb" }))

function requireAuth(req, res, next) {
  const key = req.headers["x-api-key"]
  if (key !== API_SECRET) return res.status(401).json({ error: "Invalid API key" })
  next()
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "scraper-recorder-api" })
})

// Use Browserless /content endpoint to get HTML
async function getPageContent(url) {
  const response = await fetch(`${BROWSERLESS_URL}/content?token=${BROWSERLESS_TOKEN}&stealth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      waitForSelector: "body",
      waitForTimeout: 3000,
      bestAttempt: true,
      gotoOptions: { waitUntil: "networkidle2", timeout: 25000 },
    }),
  })
  if (!response.ok) throw new Error(`Content fetch failed: ${response.status}`)
  return response.text()
}

// Use Browserless /screenshot endpoint
async function getScreenshot(url) {
  const response = await fetch(`${BROWSERLESS_URL}/screenshot?token=${BROWSERLESS_TOKEN}&stealth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      options: { fullPage: false, type: "png" },
      gotoOptions: { waitUntil: "networkidle2", timeout: 25000 },
    }),
  })
  if (!response.ok) throw new Error(`Screenshot failed: ${response.status}`)
  const buffer = await response.buffer()
  return `data:image/png;base64,${buffer.toString("base64")}`
}

// Extract elements from HTML using cheerio-like regex parsing (no dependency needed)
function extractElements(html) {
  const results = []
  const tagRegex = /<(a|button|input|select|textarea|img|h[1-6]|p|span|li|td|th|label)(\s[^>]*?)?\/?>/gi
  let match

  while ((match = tagRegex.exec(html)) !== null && results.length < 150) {
    const tag = match[1].toLowerCase()
    const attrs = match[2] || ""

    const idMatch = attrs.match(/\bid=["']([^"']+)["']/)
    const classMatch = attrs.match(/\bclass=["']([^"']+)["']/)
    const testIdMatch = attrs.match(/\bdata-testid=["']([^"']+)["']/)
    const hrefMatch = attrs.match(/\bhref=["']([^"']+)["']/)
    const roleMatch = attrs.match(/\brole=["']([^"']+)["']/)

    let selector = ""
    if (testIdMatch) selector = `[data-testid="${testIdMatch[1]}"]`
    else if (idMatch) selector = `#${idMatch[1]}`
    else if (classMatch) {
      const firstClass = classMatch[1].trim().split(/\s+/)[0]
      selector = `${tag}.${firstClass}`
    } else selector = tag

    // Get text content (rough extraction)
    const closeIdx = html.indexOf(`</${tag}>`, match.index)
    let text = ""
    if (closeIdx > 0) {
      text = html.substring(match.index + match[0].length, closeIdx)
        .replace(/<[^>]+>/g, "").trim().substring(0, 100)
    }

    const interactiveTags = ["a", "button", "input", "select", "textarea"]
    const isInteractive = interactiveTags.includes(tag) || (roleMatch && roleMatch[1] === "button")

    let type = "container"
    if (tag === "a") type = "link"
    else if (tag === "button" || (roleMatch && roleMatch[1] === "button")) type = "button"
    else if (["input", "select", "textarea"].includes(tag)) type = "input"
    else if (tag === "img") type = "image"
    else type = "text"

    // Skip empty/duplicate selectors
    if (!text && !isInteractive && type !== "input") continue

    results.push({
      selector,
      tagName: tag,
      text: text || (hrefMatch ? hrefMatch[1].substring(0, 100) : ""),
      rect: { x: 0, y: 0, width: 0, height: 0 },
      isInteractive,
      type,
    })
  }

  return results
}

app.post("/recorder/start", requireAuth, async (req, res) => {
  const { url } = req.body
  if (!url) return res.status(400).json({ error: "url required" })

  try {
    // Run both in parallel — much faster
    const [html, screenshot] = await Promise.all([
      getPageContent(url),
      getScreenshot(url),
    ])

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const pageTitle = titleMatch ? titleMatch[1].trim() : ""
    const elements = extractElements(html)

    res.json({ screenshot, elements, currentUrl: url, pageTitle })
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to start recorder" })
  }
})

app.post("/recorder/action", requireAuth, async (req, res) => {
  const { url, actions } = req.body
  if (!url || !actions) return res.status(400).json({ error: "url and actions required" })

  try {
    // For actions, we can't replay clicks via /content endpoint
    // Just re-fetch the current URL (last action may have navigated)
    const targetUrl = url
    const [html, screenshot] = await Promise.all([
      getPageContent(targetUrl),
      getScreenshot(targetUrl),
    ])

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    const pageTitle = titleMatch ? titleMatch[1].trim() : ""
    const elements = extractElements(html)

    res.json({ screenshot, elements, currentUrl: targetUrl, pageTitle })
  } catch (err) {
    res.status(500).json({ error: err.message || "Action failed" })
  }
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Scraper Recorder API on port ${PORT}`)
  console.log(`Browserless: ${BROWSERLESS_URL}`)
})
