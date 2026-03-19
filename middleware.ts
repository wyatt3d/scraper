import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") || ""

  // Never rewrite API routes, static assets, or system paths for subdomains
  const isSystemPath = pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.startsWith("/icon") || pathname === "/favicon.ico"

  // Subdomain routing: admin.scraper.bot -> /admin
  if (hostname.startsWith("admin.") && !isSystemPath) {
    if (!pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone()
      url.pathname = `/admin${pathname === "/" ? "" : pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Subdomain routing: docs.scraper.bot -> /docs
  if (hostname.startsWith("docs.") && !isSystemPath) {
    if (!pathname.startsWith("/docs")) {
      const url = request.nextUrl.clone()
      url.pathname = `/docs${pathname === "/" ? "" : pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Subdomain routing: status.scraper.bot -> /status
  if (hostname.startsWith("status.") && !isSystemPath) {
    if (!pathname.startsWith("/status")) {
      const url = request.nextUrl.clone()
      url.pathname = `/status${pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Subdomain routing: blog.scraper.bot -> /blog
  if (hostname.startsWith("blog.") && !isSystemPath) {
    if (!pathname.startsWith("/blog")) {
      const url = request.nextUrl.clone()
      url.pathname = `/blog${pathname === "/" ? "" : pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Subdomain routing: community.scraper.bot -> /community
  if (hostname.startsWith("community.") && !isSystemPath) {
    if (!pathname.startsWith("/community")) {
      const url = request.nextUrl.clone()
      url.pathname = `/community${pathname === "/" ? "" : pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // Subdomain routing: api.scraper.bot -> /api
  if (hostname.startsWith("api.")) {
    if (!pathname.startsWith("/api")) {
      const url = request.nextUrl.clone()
      url.pathname = `/api${pathname === "/" ? "" : pathname}`
      return NextResponse.rewrite(url)
    }
  }

  // API routes require API key validation (except public endpoints)
  const publicApiPaths = ["/api/auth", "/api/tickets", "/api/health", "/api/extract", "/api/generate", "/api/checkout", "/api/email"]
  const isPublicApi = publicApiPaths.some(p => pathname.startsWith(p))
  if (pathname.startsWith("/api/") && !isPublicApi) {
    const apiKey = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "")
    if (!apiKey) {
      const referer = request.headers.get("referer")
      const origin = request.headers.get("origin")
      if (referer?.includes(hostname) || origin?.includes(hostname)) {
        return NextResponse.next()
      }
      return NextResponse.json(
        { error: "API key required. Set X-API-Key header." },
        { status: 401 }
      )
    }
    if (!apiKey.startsWith("scr_")) {
      return NextResponse.json(
        { error: "Invalid API key format. Keys start with scr_live_ or scr_test_." },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
}
