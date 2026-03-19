import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@/lib/supabase-middleware"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") || ""

  // Never rewrite API routes, static assets, or system paths for subdomains
  const isSystemPath = pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.startsWith("/icon") || pathname === "/favicon.ico"

  // Subdomain routing
  const subdomains = [
    { prefix: "admin.", path: "/admin" },
    { prefix: "docs.", path: "/docs" },
    { prefix: "status.", path: "/status" },
    { prefix: "blog.", path: "/blog" },
    { prefix: "community.", path: "/community" },
  ]

  for (const { prefix, path } of subdomains) {
    if (hostname.startsWith(prefix) && !isSystemPath) {
      if (!pathname.startsWith(path)) {
        const url = request.nextUrl.clone()
        url.pathname = `${path}${pathname === "/" ? "" : pathname}`
        return NextResponse.rewrite(url)
      }
    }
  }

  if (hostname.startsWith("api.") && !pathname.startsWith("/api")) {
    const url = request.nextUrl.clone()
    url.pathname = `/api${pathname === "/" ? "" : pathname}`
    return NextResponse.rewrite(url)
  }

  // Dashboard routes require authentication
  const dashboardPaths = ["/dashboard", "/flows", "/runs", "/monitoring", "/api-keys",
    "/settings", "/playground", "/templates", "/workflow-builder", "/marketplace",
    "/analytics", "/usage", "/webhooks", "/integrations", "/mcp", "/proxies",
    "/secrets", "/sessions", "/api-versions", "/sso", "/api-logs", "/audit-log",
    "/pipelines", "/reports", "/graphql", "/api-playground", "/admin"]

  const isDashboardPath = dashboardPaths.some(p => pathname.startsWith(p))

  if (isDashboardPath) {
    const { supabase, response } = createMiddlewareClient(request)
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const signInUrl = request.nextUrl.clone()
      signInUrl.pathname = "/sign-in"
      signInUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(signInUrl)
    }

    return response
  }

  // API routes require API key validation (except public endpoints)
  const publicApiPaths = ["/api/auth", "/api/tickets", "/api/health", "/api/checkout"]
  const isPublicApi = publicApiPaths.some(p => pathname.startsWith(p))
  if (pathname.startsWith("/api/") && !isPublicApi) {
    const apiKey = request.headers.get("x-api-key") || request.headers.get("authorization")?.replace("Bearer ", "")
    if (!apiKey) {
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
    // Note: Full key validation against the database cannot run in edge middleware.
    // API routes must call validateApiKey() from lib/api-auth.ts for DB verification.
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
}
