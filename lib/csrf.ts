import { NextRequest, NextResponse } from "next/server"

const ALLOWED_ORIGINS = [
  "https://scraper.bot",
  "https://admin.scraper.bot",
  "http://localhost:3000",
  "http://localhost:3001",
]

export function checkCsrf(req: NextRequest): NextResponse | null {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return null

  const origin = req.headers.get("origin")
  if (!origin) return null

  if (ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed))) return null

  return NextResponse.json(
    { error: "CSRF validation failed: origin not allowed" },
    { status: 403 }
  )
}
