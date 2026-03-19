"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

type HeaderEntry = { name: string; value: string }
type SecurityCheck = {
  label: string
  status: "pass" | "warn" | "fail"
  detail: string
}

interface InspectionResult {
  status: number
  statusText: string
  responseTime: number
  headers: HeaderEntry[]
  security: SecurityCheck[]
}

function generateMockHeaders(url: string): InspectionResult {
  let hostname = ""
  try {
    hostname = new URL(url).hostname
  } catch {
    hostname = url.replace(/^https?:\/\//, "").split("/")[0]
  }

  const isHttps = url.startsWith("https://") || !url.startsWith("http://")

  let server = "nginx"
  let poweredBy = ""
  const extraHeaders: HeaderEntry[] = []

  if (hostname.includes("google")) {
    server = "gws"
    extraHeaders.push({ name: "x-xss-protection", value: "0" })
    extraHeaders.push({
      name: "alt-svc",
      value: 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000',
    })
  } else if (hostname.includes("github")) {
    server = "GitHub.com"
    extraHeaders.push({
      name: "x-github-request-id",
      value: "A1B2:3C4D:5E6F:7890:ABCDEF01",
    })
    extraHeaders.push({
      name: "content-security-policy",
      value: "default-src 'none'; style-src 'unsafe-inline'",
    })
  } else if (hostname.includes("cloudflare") || hostname.includes(".cf")) {
    server = "cloudflare"
    extraHeaders.push({ name: "cf-ray", value: "8a1b2c3d4e5f6-IAD" })
    extraHeaders.push({ name: "cf-cache-status", value: "HIT" })
  } else if (hostname.includes("amazon") || hostname.includes("aws")) {
    server = "Server"
    extraHeaders.push({ name: "x-amz-cf-id", value: "ABC123DEF456==" })
    extraHeaders.push({ name: "x-amz-cf-pop", value: "IAD55-C1" })
  } else if (hostname.includes("wordpress") || hostname.includes("wp")) {
    server = "Apache"
    poweredBy = "PHP/8.2"
    extraHeaders.push({ name: "x-pingback", value: `${url}/xmlrpc.php` })
  } else {
    server = "cloudflare"
    poweredBy = "Next.js"
  }

  const hasHsts = isHttps
  const hasXfo = true
  const hasCsp = hostname.includes("github")
  const hasXcto = true

  const baseHeaders: HeaderEntry[] = [
    { name: "content-type", value: "text/html; charset=utf-8" },
    { name: "server", value: server },
    ...(poweredBy ? [{ name: "x-powered-by", value: poweredBy }] : []),
    { name: "cache-control", value: "public, max-age=3600" },
    { name: "content-encoding", value: "gzip" },
    { name: "content-length", value: "42,531" },
    { name: "x-frame-options", value: "SAMEORIGIN" },
    ...(hasHsts
      ? [
          {
            name: "strict-transport-security",
            value: "max-age=31536000; includeSubDomains",
          },
        ]
      : []),
    { name: "x-content-type-options", value: "nosniff" },
    {
      name: "referrer-policy",
      value: "strict-origin-when-cross-origin",
    },
    ...extraHeaders,
  ]

  const security: SecurityCheck[] = [
    {
      label: "HTTPS",
      status: isHttps ? "pass" : "fail",
      detail: isHttps ? "Yes" : "No",
    },
    {
      label: "HSTS",
      status: hasHsts ? "pass" : "fail",
      detail: hasHsts ? "Yes" : "Not set",
    },
    {
      label: "X-Frame-Options",
      status: hasXfo ? "pass" : "warn",
      detail: hasXfo ? "Set" : "Not set",
    },
    {
      label: "CSP",
      status: hasCsp ? "pass" : "warn",
      detail: hasCsp ? "Set" : "Not set",
    },
    {
      label: "X-Content-Type-Options",
      status: hasXcto ? "pass" : "warn",
      detail: hasXcto ? "Set" : "Not set",
    },
  ]

  const responseTime = 100 + Math.floor(Math.random() * 400)

  return {
    status: 200,
    statusText: "OK",
    responseTime,
    headers: baseHeaders,
    security,
  }
}

export default function HeadersPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<InspectionResult | null>(null)
  const [error, setError] = useState("")

  const handleInspect = useCallback(() => {
    setError("")
    setResult(null)

    const trimmed = url.trim()
    if (!trimmed) {
      setError("Enter a URL to inspect.")
      return
    }

    let normalized = trimmed
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      normalized = "https://" + normalized
    }

    try {
      new URL(normalized)
    } catch {
      setError("Enter a valid URL.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      setResult(generateMockHeaders(normalized))
      setLoading(false)
    }, 800)
  }, [url])

  const statusIcon = (s: "pass" | "warn" | "fail") => {
    if (s === "pass")
      return <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
    if (s === "warn")
      return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
    return <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Logo />
              <Badge variant="secondary" className="text-xs">
                Free Tools
              </Badge>
            </div>
            <Link
              href="/tools"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              All Tools
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">
            HTTP Header Inspector
          </h1>
          <p className="text-muted-foreground">
            Enter a URL to inspect its HTTP response headers and security
            configuration.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="font-mono text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInspect()
              }}
            />
            <Button onClick={handleInspect} disabled={loading} className="shrink-0">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Inspecting...
                </>
              ) : (
                "Inspect"
              )}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {result && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Response
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-600 hover:bg-green-600 text-white">
                        {result.status} {result.statusText}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {result.responseTime}ms
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left font-medium py-2 pr-4 w-1/3">
                            Header
                          </th>
                          <th className="text-left font-medium py-2">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.headers.map((h, i) => (
                          <tr
                            key={i}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-2 pr-4">
                              <code className="font-mono text-xs text-blue-600">
                                {h.name}
                              </code>
                            </td>
                            <td className="py-2">
                              <code className="font-mono text-xs break-all">
                                {h.value}
                              </code>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.security.map((check, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                          check.status === "pass"
                            ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                            : check.status === "warn"
                              ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
                              : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                        }`}
                      >
                        {statusIcon(check.status)}
                        <span className="font-medium">{check.label}:</span>
                        <span className="text-muted-foreground">
                          {check.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Note:</strong> These are simulated headers for
                  demonstration. For live header inspection, use the Scraper.bot
                  API:
                </p>
                <pre className="bg-background rounded p-3 font-mono text-xs overflow-x-auto">
                  {`POST /api/extract\n{\n  "url": "${url.trim() || "https://example.com"}",\n  "instructions": "headers"\n}`}
                </pre>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Powered by{" "}
            <span className="font-serif font-semibold">
              Scraper<span className="text-blue-600">.bot</span>
            </span>
          </p>
          <Link href="/pricing">
            <Button variant="default">
              Get real-time headers with Scraper.bot
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
