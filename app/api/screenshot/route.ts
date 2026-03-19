import { NextResponse } from "next/server"
import { takeScreenshot } from "@/lib/engine/scraper"

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: "url required" }, { status: 400 })

    const result = await takeScreenshot(url)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 422 })
    }
    return NextResponse.json({ success: true, screenshot: result.data })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 })
  }
}
