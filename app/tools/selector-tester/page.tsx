"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Search, AlertCircle, CheckCircle } from "lucide-react"

const DEFAULT_HTML = `<div class="product-list">
  <div class="product-card">
    <h2 class="title">Wireless Headphones</h2>
    <span class="price">$79.99</span>
    <span class="rating">4.5 stars</span>
  </div>
  <div class="product-card">
    <h2 class="title">USB-C Hub</h2>
    <span class="price">$34.99</span>
    <span class="rating">4.2 stars</span>
  </div>
</div>`

interface MatchResult {
  text: string
  tagName: string
  selectorPath: string
  outerHTML: string
}

function getSelectorPath(el: Element): string {
  const parts: string[] = []
  let current: Element | null = el
  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let selector = current.tagName.toLowerCase()
    if (current.className && typeof current.className === "string") {
      selector += "." + current.className.trim().split(/\s+/).join(".")
    }
    parts.unshift(selector)
    current = current.parentElement
  }
  return parts.join(" > ")
}

function highlightHTML(html: string, selector: string): string {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const matches = doc.querySelectorAll(selector)
    matches.forEach((el) => {
      const wrapper = doc.createElement("mark")
      wrapper.setAttribute("data-match", "true")
      while (el.firstChild) {
        wrapper.appendChild(el.firstChild)
      }
      el.appendChild(wrapper)
    })
    return doc.body.innerHTML
  } catch {
    return html
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export default function SelectorTesterPage() {
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [selector, setSelector] = useState("")
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasRun, setHasRun] = useState(false)
  const [highlightedHtml, setHighlightedHtml] = useState("")

  const runTest = useCallback(() => {
    setError(null)
    setMatches([])
    setHighlightedHtml("")
    setHasRun(true)

    if (!selector.trim()) {
      setError("Enter a CSS selector to test.")
      return
    }

    if (!html.trim()) {
      setError("Enter some HTML to test against.")
      return
    }

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      let elements: NodeListOf<Element>
      try {
        elements = doc.querySelectorAll(selector)
      } catch {
        setError("Invalid CSS selector. Check your syntax and try again.")
        return
      }

      const results: MatchResult[] = Array.from(elements).map((el) => ({
        text: el.textContent?.trim() || "",
        tagName: el.tagName.toLowerCase(),
        selectorPath: getSelectorPath(el),
        outerHTML: el.outerHTML,
      }))

      setMatches(results)
      setHighlightedHtml(highlightHTML(html, selector))
    } catch {
      setError("Could not parse the HTML. Check for syntax errors.")
    }
  }, [html, selector])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      runTest()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
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
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              CSS Selector Tester
            </h1>
            <Badge variant="secondary" className="text-xs">
              Free Tool by Scraper.bot
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Paste HTML, write a CSS selector, and see matching elements
            highlighted in real time.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">HTML Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                  placeholder="Paste your HTML here..."
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-6">
            <div className="flex gap-2">
              <Input
                value={selector}
                onChange={(e) => setSelector(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=".product-card .title"
                className="font-mono text-sm"
              />
              <Button onClick={runTest} className="shrink-0">
                <Search className="w-4 h-4 mr-2" />
                Test
              </Button>
            </div>

            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Results</CardTitle>
                  {hasRun && !error && (
                    <Badge
                      variant={matches.length > 0 ? "default" : "secondary"}
                      className={
                        matches.length > 0
                          ? "bg-green-600 hover:bg-green-600"
                          : ""
                      }
                    >
                      {matches.length} match{matches.length !== 1 ? "es" : ""}{" "}
                      found
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!hasRun && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Enter a CSS selector and click Test to see results.
                  </p>
                )}

                {error && (
                  <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 rounded-md p-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                {hasRun && !error && matches.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No elements matched that selector.
                  </p>
                )}

                {matches.length > 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {matches.map((match, i) => (
                        <div
                          key={i}
                          className="border border-border rounded-md p-3 text-sm"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
                            <span className="font-mono text-xs text-muted-foreground truncate">
                              &lt;{match.tagName}&gt;
                            </span>
                          </div>
                          <p className="font-medium mb-1">
                            {match.text || "(empty)"}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground break-all">
                            {match.selectorPath}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        HTML Preview (matches highlighted)
                      </p>
                      <div
                        className="bg-muted rounded-md p-3 font-mono text-xs whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto [&_mark[data-match]]:bg-yellow-200 [&_mark[data-match]]:dark:bg-yellow-800 [&_mark[data-match]]:px-0.5 [&_mark[data-match]]:rounded-sm"
                        dangerouslySetInnerHTML={{
                          __html: escapeHtml(highlightedHtml)
                            .replace(
                              /&lt;mark data-match=&quot;true&quot;&gt;/g,
                              '<mark data-match="true">'
                            )
                            .replace(/&lt;\/mark&gt;/g, "</mark>"),
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
              Want to automate this? Create a Scraper.bot flow
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
