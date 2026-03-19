import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { scrapeWithBrowser } from "@/lib/engine/scraper"
import * as cheerio from "cheerio"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { url, description } = await request.json()
    if (!description) return NextResponse.json({ error: "description required" }, { status: 400 })

    let pageAnalysis = ""
    if (url) {
      try {
        const result = await scrapeWithBrowser(url)
        if (result.success && result.html) {
          pageAnalysis = analyzePageStructure(result.html, url)
        } else {
          const response = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              "Accept": "text/html",
            },
            signal: AbortSignal.timeout(10000),
          })
          if (response.ok) {
            const html = await response.text()
            pageAnalysis = analyzePageStructure(html, url)
          }
        }
      } catch {
        pageAnalysis = "Could not fetch the target page. Generate best-guess selectors."
      }
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      messages: [{
        role: "user",
        content: `You are a web scraping expert. Generate a scraping flow definition as JSON.

TARGET URL: ${url || "not specified"}
USER REQUEST: ${description}

${pageAnalysis ? `ACTUAL PAGE ANALYSIS (from fetching the real page):
${pageAnalysis}

Use the ACTUAL selectors and elements found above. Do NOT guess — use only selectors that exist on the page.` : "No page analysis available. Use your best judgment for selectors."}

Respond with ONLY a JSON object (no markdown, no code blocks, no explanation):
{
  "name": "Flow name",
  "description": "What this flow does",
  "url": "${url || "https://example.com"}",
  "mode": "extract" or "monitor" or "interact",
  "steps": [
    { "id": "s1", "type": "navigate", "label": "description" },
    { "id": "s2", "type": "extract", "label": "description", "extractionRules": [
      { "field": "fieldName", "selector": "actual.css.selector", "transform": "text" }
    ] }
  ],
  "outputSchema": { "fieldName": "string" }
}

Step types: navigate, click, fill, extract, wait, scroll, condition, loop
For click steps include: "selector": "css.selector"
For fill steps include: "selector": "css.selector", "value": "text to type"
For extract steps include extraction rules with REAL selectors from the page.
Transform types: text, number, url, date, html`
      }],
    })

    const content = message.content[0]
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type" }, { status: 500 })
    }

    let flowDef
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error("No JSON found")
      flowDef = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw: content.text }, { status: 422 })
    }

    return NextResponse.json({ flow: flowDef, pageAnalyzed: !!pageAnalysis })
  } catch (err: unknown) {
    const error = err as { status?: number; error?: { message?: string } }
    if (error.status === 400 && error.error?.message?.includes("credit balance")) {
      return NextResponse.json({ error: "AI service temporarily unavailable.", fallback: true }, { status: 503 })
    }
    const message = err instanceof Error ? err.message : "AI generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function analyzePageStructure(html: string, url: string): string {
  const $ = cheerio.load(html)
  const analysis: string[] = []

  analysis.push(`Page Title: ${$("title").text().trim()}`)

  const headings: string[] = []
  $("h1, h2, h3").each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length < 100) headings.push(`${el.tagName}: "${text}"`)
  })
  if (headings.length) analysis.push(`\nHeadings:\n${headings.slice(0, 10).join("\n")}`)

  const forms: string[] = []
  $("form").each((i, el) => {
    const action = $(el).attr("action") || ""
    const inputs = $(el).find("input, select, textarea").map((_, inp) => {
      const name = $(inp).attr("name") || $(inp).attr("id") || $(inp).attr("placeholder") || ""
      const type = $(inp).attr("type") || inp.tagName.toLowerCase()
      return `  ${inp.tagName}[name="${name}", type="${type}"]`
    }).get()
    forms.push(`Form ${i + 1} (action="${action}"):\n${inputs.join("\n")}`)
  })
  if (forms.length) analysis.push(`\nForms Found:\n${forms.join("\n\n")}`)

  const links: string[] = []
  $("a[href]").each((_, el) => {
    const text = $(el).text().trim()
    const href = $(el).attr("href") || ""
    if (text && text.length > 2 && text.length < 80 && href !== "#") {
      const classes = $(el).attr("class") || ""
      links.push(`a${classes ? `.${classes.split(" ")[0]}` : ""}[href="${href.slice(0, 60)}"]: "${text.slice(0, 50)}"`)
    }
  })
  if (links.length) analysis.push(`\nLinks (${links.length} total, showing first 15):\n${links.slice(0, 15).join("\n")}`)

  $("table").each((i, el) => {
    const headers = $(el).find("th").map((_, th) => $(th).text().trim()).get()
    const rowCount = $(el).find("tbody tr, tr").length
    if (headers.length) {
      analysis.push(`\nTable ${i + 1} (${rowCount} rows): columns = [${headers.join(", ")}]`)
      analysis.push(`  Row selector: table:nth-of-type(${i + 1}) tbody tr`)
      headers.forEach((h, j) => {
        analysis.push(`  Column "${h}": td:nth-child(${j + 1})`)
      })
    }
  })

  const repeatedPatterns: Record<string, number> = {}
  $("*").each((_, el) => {
    const cls = $(el).attr("class")
    if (cls) {
      const mainClass = cls.split(" ")[0]
      if (mainClass && mainClass.length > 3) {
        repeatedPatterns[mainClass] = (repeatedPatterns[mainClass] || 0) + 1
      }
    }
  })
  const listings = Object.entries(repeatedPatterns)
    .filter(([, count]) => count >= 3 && count <= 200)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
  if (listings.length) {
    analysis.push(`\nRepeated Elements (likely data listings):`)
    listings.forEach(([cls, count]) => {
      const sample = $(`.${cls}`).first()
      const tag = sample.prop("tagName")?.toLowerCase() || "div"
      const sampleText = sample.text().trim().slice(0, 60)
      analysis.push(`  .${cls} (${tag}, ${count}x): "${sampleText}..."`)
    })
  }

  const buttons: string[] = []
  $("button, [role=button], input[type=submit]").each((_, el) => {
    const text = $(el).text().trim() || $(el).attr("value") || ""
    const cls = $(el).attr("class")?.split(" ")[0] || ""
    const testId = $(el).attr("data-testid") || ""
    if (text && text.length < 50) {
      let selector = el.tagName.toLowerCase()
      if (testId) selector = `[data-testid="${testId}"]`
      else if (cls) selector += `.${cls}`
      buttons.push(`${selector}: "${text}"`)
    }
  })
  if (buttons.length) analysis.push(`\nButtons:\n${buttons.slice(0, 10).join("\n")}`)

  return analysis.join("\n")
}
