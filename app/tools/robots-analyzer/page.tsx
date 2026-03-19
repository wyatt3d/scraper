"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock,
  Bot,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react"

const SAMPLE_ROBOTS = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

User-agent: Googlebot
Allow: /

Sitemap: https://example.com/sitemap.xml

Crawl-delay: 10`

interface UserAgentBlock {
  userAgent: string
  allow: string[]
  disallow: string[]
  crawlDelay: number | null
}

interface ParseResult {
  blocks: UserAgentBlock[]
  sitemaps: string[]
  allAllowed: string[]
  allDisallowed: string[]
  assessment: string
}

function parseRobotsTxt(content: string): ParseResult {
  const lines = content.split("\n").map((l) => l.trim())
  const blocks: UserAgentBlock[] = []
  const sitemaps: string[] = []
  let current: UserAgentBlock | null = null

  for (const line of lines) {
    if (!line || line.startsWith("#")) continue

    const colonIdx = line.indexOf(":")
    if (colonIdx === -1) continue

    const directive = line.slice(0, colonIdx).trim().toLowerCase()
    const value = line.slice(colonIdx + 1).trim()

    if (directive === "user-agent") {
      if (current) blocks.push(current)
      current = {
        userAgent: value,
        allow: [],
        disallow: [],
        crawlDelay: null,
      }
    } else if (directive === "allow" && current) {
      if (value) current.allow.push(value)
    } else if (directive === "disallow" && current) {
      if (value) current.disallow.push(value)
    } else if (directive === "crawl-delay" && current) {
      const num = parseInt(value, 10)
      if (!isNaN(num)) current.crawlDelay = num
    } else if (directive === "sitemap") {
      if (value) sitemaps.push(value)
    }
  }

  if (current) blocks.push(current)

  const allAllowed = Array.from(
    new Set(blocks.flatMap((b) => b.allow))
  )
  const allDisallowed = Array.from(
    new Set(blocks.flatMap((b) => b.disallow))
  )

  const wildcardBlock = blocks.find((b) => b.userAgent === "*")
  const hasStrictWildcard =
    wildcardBlock &&
    wildcardBlock.disallow.length > 0 &&
    !wildcardBlock.allow.includes("/")
  const hasFullDisallow = blocks.some((b) =>
    b.disallow.some((d) => d === "/")
  )
  const restrictedBots = blocks.filter(
    (b) => b.userAgent !== "*" && b.disallow.length > 0
  )

  let assessment: string
  if (hasFullDisallow) {
    assessment =
      "This site blocks all crawling for at least one user-agent."
  } else if (hasStrictWildcard) {
    assessment =
      "This site restricts crawling for all bots on certain paths."
  } else if (restrictedBots.length > 0) {
    assessment = `This site restricts certain bots (${restrictedBots.map((b) => b.userAgent).join(", ")}).`
  } else if (allDisallowed.length > 0) {
    assessment =
      "This site allows most crawling but restricts specific paths."
  } else {
    assessment = "This site allows scraping by all bots."
  }

  return { blocks, sitemaps, allAllowed, allDisallowed, assessment }
}

export default function RobotsAnalyzerPage() {
  const [url, setUrl] = useState("")
  const [content, setContent] = useState(SAMPLE_ROBOTS)
  const [result, setResult] = useState<ParseResult | null>(null)

  const handleAnalyze = useCallback(() => {
    if (!content.trim()) return
    setResult(parseRobotsTxt(content))
  }, [content])

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
            robots.txt Analyzer
          </h1>
          <p className="text-muted-foreground">
            Parse and analyze robots.txt rules to understand what can and
            cannot be scraped.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex gap-3">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/robots.txt (for reference only)"
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Paste robots.txt content below:
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="font-mono text-sm"
              placeholder="Paste robots.txt content here..."
            />
          </div>

          <Button onClick={handleAnalyze} className="w-full sm:w-auto">
            <Bot className="w-4 h-4 mr-2" />
            Analyze
          </Button>

          {result && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {result.allDisallowed.length === 0 ? (
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    Overall Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{result.assessment}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    User-Agent Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left font-medium py-2 pr-4">
                            User-Agent
                          </th>
                          <th className="text-left font-medium py-2 pr-4">
                            Allowed
                          </th>
                          <th className="text-left font-medium py-2 pr-4">
                            Disallowed
                          </th>
                          <th className="text-left font-medium py-2">
                            Crawl-Delay
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.blocks.map((block, i) => (
                          <tr
                            key={i}
                            className="border-b border-border last:border-0 align-top"
                          >
                            <td className="py-2 pr-4">
                              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                {block.userAgent}
                              </code>
                            </td>
                            <td className="py-2 pr-4">
                              {block.allow.length > 0 ? (
                                <div className="space-y-1">
                                  {block.allow.map((p, j) => (
                                    <div
                                      key={j}
                                      className="flex items-center gap-1 text-green-600"
                                    >
                                      <CheckCircle className="w-3 h-3 shrink-0" />
                                      <code className="font-mono text-xs">
                                        {p}
                                      </code>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  None
                                </span>
                              )}
                            </td>
                            <td className="py-2 pr-4">
                              {block.disallow.length > 0 ? (
                                <div className="space-y-1">
                                  {block.disallow.map((p, j) => (
                                    <div
                                      key={j}
                                      className="flex items-center gap-1 text-red-500"
                                    >
                                      <XCircle className="w-3 h-3 shrink-0" />
                                      <code className="font-mono text-xs">
                                        {p}
                                      </code>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  None
                                </span>
                              )}
                            </td>
                            <td className="py-2">
                              {block.crawlDelay !== null ? (
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="w-3 h-3 shrink-0" />
                                  {block.crawlDelay}s
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  --
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {result.allDisallowed.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Allowed Paths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.allAllowed.length > 0 ? (
                        <ul className="space-y-1">
                          {result.allAllowed.map((p, i) => (
                            <li key={i}>
                              <code className="font-mono text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                                {p}
                              </code>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No explicit allow rules.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-red-500 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Disallowed Paths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {result.allDisallowed.map((p, i) => (
                          <li key={i}>
                            <code className="font-mono text-xs bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded">
                              {p}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {result.sitemaps.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Sitemaps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {result.sitemaps.map((s, i) => (
                        <li key={i}>
                          <code className="font-mono text-xs text-blue-600">
                            {s}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
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
              Scraper.bot automatically respects robots.txt rules
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
