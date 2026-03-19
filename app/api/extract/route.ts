import { NextResponse } from "next/server"
import { scrapeUrl, scrapeWithBrowser, type ExtractionRule } from "@/lib/engine/scraper"

function isUrlSafe(urlStr: string): boolean {
  try {
    const url = new URL(urlStr)
    if (!["http:", "https:"].includes(url.protocol)) return false
    const hostname = url.hostname
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") return false
    if (hostname.startsWith("10.") || hostname.startsWith("192.168.") || hostname.startsWith("169.254.")) return false
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return false
    if (hostname.endsWith(".internal") || hostname.endsWith(".local")) return false
    return true
  } catch { return false }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, rules, mode } = body

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }

    if (!isUrlSafe(url)) {
      return NextResponse.json({ error: "URL is not allowed" }, { status: 400 })
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
