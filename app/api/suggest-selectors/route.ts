import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { scrapeWithBrowser } from "@/lib/engine/scraper"
import * as cheerio from "cheerio"

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { url, fieldDescription } = await request.json()
    if (!url || !fieldDescription) {
      return NextResponse.json({ error: "url and fieldDescription required" }, { status: 400 })
    }

    const result = await scrapeWithBrowser(url)
    if (!result.success || !result.html) {
      return NextResponse.json({ error: "Could not fetch page" }, { status: 422 })
    }

    const $ = cheerio.load(result.html)
    const candidates: string[] = []

    $("*").each((_, el) => {
      const text = $(el).text().trim()
      const tag = (el as any).tagName?.toLowerCase()
      if (!tag || ["html", "head", "body", "script", "style"].includes(tag)) return
      if (text.length > 3 && text.length < 200) {
        const cls = $(el).attr("class")?.split(" ")[0]
        const id = $(el).attr("id")
        const dataTestId = $(el).attr("data-testid")

        if (dataTestId) candidates.push(`[data-testid="${dataTestId}"]`)
        else if (id) candidates.push(`#${id}`)
        else if (cls) candidates.push(`${tag}.${cls}`)
      }
    })

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `Given this web page analysis, suggest the best CSS selector to extract "${fieldDescription}".

Available selectors and their text content (first 30):
${candidates.slice(0, 30).map(s => {
  const el = $(s).first()
  return `${s}: "${el.text().trim().slice(0, 80)}"`
}).join("\n")}

Respond with ONLY a JSON object:
{"selector": "the.best.selector", "confidence": 0.9, "reason": "why this selector"}`
      }]
    })

    const content = message.content[0]
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response" }, { status: 500 })
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse suggestion" }, { status: 422 })
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]))
  } catch (err) {
    const message = err instanceof Error ? err.message : "Suggestion failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
