import * as cheerio from "cheerio"

export interface ScrapeResult {
  success: boolean
  url: string
  title: string
  items: Record<string, unknown>[]
  html?: string
  error?: string
  duration: number
}

export interface ExtractionRule {
  field: string
  selector: string
  attribute?: string
  transform?: "text" | "html" | "number" | "url"
}

export async function scrapeUrl(url: string, rules?: ExtractionRule[]): Promise<ScrapeResult> {
  const start = Date.now()

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return { success: false, url, title: "", items: [], error: `HTTP ${response.status}: ${response.statusText}`, duration: Date.now() - start }
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const title = $("title").text().trim()

    if (!rules || rules.length === 0) {
      const items = autoExtract($, url)
      return { success: true, url, title, items, duration: Date.now() - start }
    }

    const items = extractWithRules($, rules, url)
    return { success: true, url, title, items, duration: Date.now() - start }

  } catch (err) {
    const message = err instanceof Error ? err.message : "Scrape failed"
    return { success: false, url, title: "", items: [], error: message, duration: Date.now() - start }
  }
}

export async function scrapeWithBrowser(url: string, rules?: ExtractionRule[]): Promise<ScrapeResult> {
  const start = Date.now()
  const browserlessUrl = process.env.BROWSERLESS_URL
  const browserlessToken = process.env.BROWSERLESS_TOKEN

  if (!browserlessUrl || !browserlessToken) {
    return scrapeUrl(url, rules)
  }

  try {
    const response = await fetch(`${browserlessUrl}/content?token=${browserlessToken}&stealth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        waitForSelector: "body",
        waitForTimeout: 5000,
        bestAttempt: true,
        gotoOptions: { waitUntil: "networkidle2", timeout: 45000 },
        addScriptTag: [
          {
            content: `
              // Override navigator properties to avoid bot detection
              Object.defineProperty(navigator, 'webdriver', { get: () => false });
              Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
              Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
              window.chrome = { runtime: {} };
            `
          }
        ],
      }),
      signal: AbortSignal.timeout(50000),
    })

    if (!response.ok) {
      return scrapeUrl(url, rules)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const title = $("title").text().trim()

    const items = rules && rules.length > 0
      ? extractWithRules($, rules, url)
      : autoExtract($, url)

    return { success: true, url, title, items, duration: Date.now() - start }
  } catch {
    return scrapeUrl(url, rules)
  }
}

export async function takeScreenshot(url: string): Promise<{ success: boolean; data?: string; error?: string }> {
  const browserlessUrl = process.env.BROWSERLESS_URL
  const browserlessToken = process.env.BROWSERLESS_TOKEN

  if (!browserlessUrl || !browserlessToken) {
    return { success: false, error: "Browserless not configured" }
  }

  try {
    const response = await fetch(`${browserlessUrl}/screenshot?token=${browserlessToken}&stealth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        options: { fullPage: false, type: "png" },
        gotoOptions: { waitUntil: "networkidle2", timeout: 20000 },
      }),
      signal: AbortSignal.timeout(25000),
    })

    if (!response.ok) return { success: false, error: `HTTP ${response.status}` }

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    return { success: true, data: `data:image/png;base64,${base64}` }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Screenshot failed" }
  }
}

function extractWithRules($: cheerio.CheerioAPI, rules: ExtractionRule[], baseUrl: string): Record<string, unknown>[] {
  const firstRule = rules[0]
  const elements = $(firstRule.selector)

  if (elements.length === 0) return []

  const items: Record<string, unknown>[] = []
  const parentSelector = findCommonParent($, rules)

  if (parentSelector) {
    $(parentSelector).each((_, parent) => {
      const item: Record<string, unknown> = {}
      const $parent = $(parent)

      for (const rule of rules) {
        const relativeSelector = rule.selector.split(" ").pop() || rule.selector
        const el = $parent.find(relativeSelector).first()
        item[rule.field] = extractValue(el, rule, $, baseUrl)
      }

      if (Object.values(item).some(v => v !== null && v !== "")) {
        items.push(item)
      }
    })
  } else {
    const maxLen = Math.max(...rules.map(r => $(r.selector).length))
    for (let i = 0; i < maxLen; i++) {
      const item: Record<string, unknown> = {}
      for (const rule of rules) {
        const el = $(rule.selector).eq(i)
        item[rule.field] = extractValue(el, rule, $, baseUrl)
      }
      items.push(item)
    }
  }

  return items
}

function extractValue(el: cheerio.Cheerio<cheerio.AnyNode>, rule: ExtractionRule, $: cheerio.CheerioAPI, baseUrl: string): unknown {
  if (!el || el.length === 0) return null

  if (rule.attribute) {
    const val = el.attr(rule.attribute) || ""
    if (rule.transform === "url" && val && !val.startsWith("http")) {
      return new URL(val, baseUrl).href
    }
    return val
  }

  const text = el.text().trim()

  switch (rule.transform) {
    case "number":
      return parseFloat(text.replace(/[^0-9.-]/g, "")) || 0
    case "html":
      return el.html() || ""
    case "url": {
      const href = el.attr("href") || ""
      if (href && !href.startsWith("http")) {
        return new URL(href, baseUrl).href
      }
      return href
    }
    default:
      return text
  }
}

function findCommonParent($: cheerio.CheerioAPI, rules: ExtractionRule[]): string | null {
  const firstSelector = rules[0].selector
  const parts = firstSelector.split(" ")
  if (parts.length > 1) {
    return parts.slice(0, -1).join(" ")
  }
  return null
}

function autoExtract($: cheerio.CheerioAPI, url: string): Record<string, unknown>[] {
  const items: Record<string, unknown>[] = []

  $("a").each((_, el) => {
    const $el = $(el)
    const text = $el.text().trim()
    const href = $el.attr("href")
    if (text && href && text.length > 5 && text.length < 200) {
      const fullUrl = href.startsWith("http") ? href : (() => {
        try { return new URL(href, url).href } catch { return href }
      })()
      items.push({ text, url: fullUrl })
    }
  })

  const seen = new Set<string>()
  return items.filter(item => {
    const key = `${item.text}|${item.url}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 50)
}
