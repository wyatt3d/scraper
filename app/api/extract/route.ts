import { NextResponse } from "next/server"
import { scrapeUrl, scrapeWithBrowser, type ExtractionRule } from "@/lib/engine/scraper"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, rules, mode } = body

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }

    let extractionRules: ExtractionRule[] | undefined = rules

    const result = mode === "browser"
      ? await scrapeWithBrowser(url, extractionRules)
      : await scrapeUrl(url, extractionRules)

    if (!result.success) {
      return NextResponse.json({
        error: result.error,
        url: result.url,
        duration: result.duration,
      }, { status: 422 })
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      title: result.title,
      items: result.items,
      itemCount: result.items.length,
      duration: result.duration,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
