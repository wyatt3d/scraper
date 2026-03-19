import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API routes require API key validation
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    const apiKey = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "")
    if (!apiKey) {
      // Allow requests from the app itself (same origin)
      const referer = request.headers.get("referer")
      const origin = request.headers.get("origin")
      const host = request.headers.get("host")
      if (referer?.includes(host || "") || origin?.includes(host || "")) {
        return NextResponse.next()
      }
      return NextResponse.json(
        { error: "API key required. Set X-API-Key header." },
        { status: 401 }
      )
    }
    // In production, validate the key against the database
    // For now, accept any key with the scr_ prefix
    if (!apiKey.startsWith("scr_")) {
      return NextResponse.json(
        { error: "Invalid API key format. Keys start with scr_live_ or scr_test_." },
        { status: 403 }
      )
    }
  }

  // Dashboard routes - check for auth cookie (placeholder)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/flows") ||
      pathname.startsWith("/runs") || pathname.startsWith("/monitoring") ||
      pathname.startsWith("/api-keys") || pathname.startsWith("/settings") ||
      pathname.startsWith("/playground") || pathname.startsWith("/templates")) {
    // In production, check for session cookie
    // For now, allow all access for demo
  }

  // Admin routes - check for admin role (placeholder)
  if (pathname.startsWith("/admin")) {
    // In production, verify admin role from session
    // For now, allow all access for demo
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/flows/:path*", "/runs/:path*",
            "/monitoring/:path*", "/api-keys/:path*", "/settings/:path*", "/admin/:path*",
            "/playground/:path*", "/templates/:path*"],
}
