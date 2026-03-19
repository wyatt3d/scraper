"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

function xpathToCss(xpath: string): { result: string; error?: string } {
  let expr = xpath.trim()
  if (!expr) return { result: "", error: "Enter an XPath expression." }

  try {
    // Remove leading //
    expr = expr.replace(/^\/\//, "")

    // Split on // (descendant) and / (child)
    const tokens: { type: "descendant" | "child"; segment: string }[] = []
    let remaining = expr
    let first = true

    while (remaining.length > 0) {
      let type: "descendant" | "child" = first ? "descendant" : "child"
      first = false

      if (remaining.startsWith("//")) {
        type = "descendant"
        remaining = remaining.slice(2)
      } else if (remaining.startsWith("/")) {
        type = "child"
        remaining = remaining.slice(1)
      }

      // Find next / or //
      const nextDouble = remaining.indexOf("//")
      const nextSingle = remaining.indexOf("/")
      let end = remaining.length

      if (nextDouble !== -1 && (nextSingle === -1 || nextDouble <= nextSingle)) {
        end = nextDouble
      } else if (nextSingle !== -1) {
        end = nextSingle
      }

      const segment = remaining.slice(0, end)
      if (segment) {
        tokens.push({ type, segment })
      }
      remaining = remaining.slice(end)
    }

    const cssParts: string[] = []
    for (let i = 0; i < tokens.length; i++) {
      const { type, segment } = tokens[i]
      const converted = convertSegment(segment)
      if (converted.error) {
        return { result: "", error: converted.error }
      }
      if (i > 0) {
        cssParts.push(type === "descendant" ? " " : " > ")
      }
      cssParts.push(converted.result)
    }

    return { result: cssParts.join("") }
  } catch {
    return { result: "", error: "Cannot convert -- complex XPath." }
  }
}

function convertSegment(segment: string): {
  result: string
  error?: string
} {
  // Match tag[predicate] or just tag
  const match = segment.match(/^([a-zA-Z*][\w-]*|\*)(?:\[(.+)\])?$/)
  if (!match) {
    return { result: "", error: `Cannot convert -- complex XPath: "${segment}"` }
  }

  let tag = match[1]
  const predicates = match[2]
  if (tag === "*") tag = "*"

  if (!predicates) return { result: tag }

  // Handle multiple predicates (split on ][)
  const preds = predicates.split("][").map((p) => p.replace(/^\[|\]$/g, ""))
  let css = tag

  for (const pred of preds) {
    const converted = convertPredicate(pred)
    if (converted.error) return { result: "", error: converted.error }
    css += converted.result
  }

  return { result: css }
}

function convertPredicate(pred: string): {
  result: string
  error?: string
} {
  // @class='value'
  const classMatch = pred.match(/^@class\s*=\s*['"]([^'"]+)['"]\s*$/)
  if (classMatch) {
    return { result: `.${classMatch[1].split(/\s+/).join(".")}` }
  }

  // @id='value'
  const idMatch = pred.match(/^@id\s*=\s*['"]([^'"]+)['"]\s*$/)
  if (idMatch) {
    return { result: `#${idMatch[1]}` }
  }

  // @attr='value'
  const attrValMatch = pred.match(
    /^@([\w-]+)\s*=\s*['"]([^'"]+)['"]\s*$/
  )
  if (attrValMatch) {
    return { result: `[${attrValMatch[1]}='${attrValMatch[2]}']` }
  }

  // @attr (has attribute)
  const attrMatch = pred.match(/^@([\w-]+)\s*$/)
  if (attrMatch) {
    return { result: `[${attrMatch[1]}]` }
  }

  // contains(@class, 'value')
  const containsClassMatch = pred.match(
    /^contains\s*\(\s*@class\s*,\s*['"]([^'"]+)['"]\s*\)\s*$/
  )
  if (containsClassMatch) {
    return { result: `[class*='${containsClassMatch[1]}']` }
  }

  // contains(@attr, 'value')
  const containsMatch = pred.match(
    /^contains\s*\(\s*@([\w-]+)\s*,\s*['"]([^'"]+)['"]\s*\)\s*$/
  )
  if (containsMatch) {
    return { result: `[${containsMatch[1]}*='${containsMatch[2]}']` }
  }

  // position: [1]
  if (pred === "1") return { result: ":first-child" }
  if (pred === "last()") return { result: ":last-child" }

  // Numeric position [n]
  const numMatch = pred.match(/^(\d+)$/)
  if (numMatch) {
    return { result: `:nth-child(${numMatch[1]})` }
  }

  return { result: "", error: `Cannot convert -- complex predicate: "${pred}"` }
}

function cssToXpath(css: string): { result: string; error?: string } {
  let expr = css.trim()
  if (!expr) return { result: "", error: "Enter a CSS selector." }

  try {
    // Split by combinators while preserving them
    const parts: string[] = []
    const combinators: string[] = []
    let current = ""

    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i]
      if (ch === ">" && current.trim()) {
        parts.push(current.trim())
        combinators.push("/")
        current = ""
      } else if (ch === " " && current.trim() && expr[i - 1] !== ">") {
        // Check if next non-space char is >
        let j = i + 1
        while (j < expr.length && expr[j] === " ") j++
        if (expr[j] === ">") {
          continue
        }
        parts.push(current.trim())
        combinators.push("//")
        current = ""
      } else {
        current += ch
      }
    }
    if (current.trim()) parts.push(current.trim())

    const xpathParts: string[] = []
    for (let i = 0; i < parts.length; i++) {
      const converted = cssSegmentToXpath(parts[i])
      if (converted.error) return { result: "", error: converted.error }
      if (i === 0) {
        xpathParts.push("//" + converted.result)
      } else {
        xpathParts.push(combinators[i - 1] + converted.result)
      }
    }

    return { result: xpathParts.join("") }
  } catch {
    return { result: "", error: "Cannot convert -- complex CSS selector." }
  }
}

function cssSegmentToXpath(segment: string): {
  result: string
  error?: string
} {
  let tag = "*"
  let rest = segment
  const predicates: string[] = []

  // Extract tag name
  const tagMatch = rest.match(/^([a-zA-Z][\w-]*)/)
  if (tagMatch) {
    tag = tagMatch[1]
    rest = rest.slice(tagMatch[0].length)
  }

  while (rest.length > 0) {
    // .class
    if (rest.startsWith(".")) {
      const match = rest.match(/^\.([a-zA-Z_][\w-]*)/)
      if (match) {
        predicates.push(`contains(@class,'${match[1]}')`)
        rest = rest.slice(match[0].length)
        continue
      }
    }

    // #id
    if (rest.startsWith("#")) {
      const match = rest.match(/^#([a-zA-Z_][\w-]*)/)
      if (match) {
        predicates.push(`@id='${match[1]}'`)
        rest = rest.slice(match[0].length)
        continue
      }
    }

    // [attr='val'] or [attr]
    if (rest.startsWith("[")) {
      const match = rest.match(/^\[([^\]]+)\]/)
      if (match) {
        const inner = match[1]
        // attr*='val'
        const containsMatch = inner.match(
          /^([\w-]+)\*=\s*['"]([^'"]+)['"]\s*$/
        )
        if (containsMatch) {
          predicates.push(
            `contains(@${containsMatch[1]},'${containsMatch[2]}')`
          )
          rest = rest.slice(match[0].length)
          continue
        }
        // attr='val'
        const eqMatch = inner.match(
          /^([\w-]+)\s*=\s*['"]([^'"]+)['"]\s*$/
        )
        if (eqMatch) {
          predicates.push(`@${eqMatch[1]}='${eqMatch[2]}'`)
          rest = rest.slice(match[0].length)
          continue
        }
        // attr (has attribute)
        const hasMatch = inner.match(/^([\w-]+)\s*$/)
        if (hasMatch) {
          predicates.push(`@${hasMatch[1]}`)
          rest = rest.slice(match[0].length)
          continue
        }
        rest = rest.slice(match[0].length)
        continue
      }
    }

    // :first-child
    if (rest.startsWith(":first-child")) {
      predicates.push("1")
      rest = rest.slice(12)
      continue
    }

    // :last-child
    if (rest.startsWith(":last-child")) {
      predicates.push("last()")
      rest = rest.slice(11)
      continue
    }

    // :nth-child(n)
    const nthMatch = rest.match(/^:nth-child\((\d+)\)/)
    if (nthMatch) {
      predicates.push(nthMatch[1])
      rest = rest.slice(nthMatch[0].length)
      continue
    }

    return {
      result: "",
      error: `Cannot convert -- unsupported CSS: "${rest}"`,
    }
  }

  if (predicates.length === 0) return { result: tag }
  return { result: `${tag}[${predicates.join(" and ")}]` }
}

const REFERENCE_TABLE = [
  { xpath: "//div", css: "div" },
  { xpath: "//div[@class='foo']", css: "div.foo" },
  { xpath: "//div[@id='bar']", css: "div#bar" },
  { xpath: "//div/span", css: "div > span" },
  { xpath: "//div//span", css: "div span" },
  { xpath: "//a[@href]", css: "a[href]" },
  { xpath: "//input[@type='text']", css: "input[type='text']" },
  { xpath: "//div[contains(@class,'foo')]", css: "div[class*='foo']" },
  { xpath: "//div[1]", css: "div:first-child" },
  { xpath: "//div[last()]", css: "div:last-child" },
]

export default function XPathConverterPage() {
  const [xpathInput, setXpathInput] = useState("")
  const [cssInput, setCssInput] = useState("")
  const [status, setStatus] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [copiedXpath, setCopiedXpath] = useState(false)
  const [copiedCss, setCopiedCss] = useState(false)

  const handleXpathToCss = useCallback(() => {
    setStatus(null)
    const { result, error } = xpathToCss(xpathInput)
    if (error) {
      setStatus({ type: "error", message: error })
      return
    }
    setCssInput(result)
    setStatus({ type: "success", message: "Converted XPath to CSS." })
  }, [xpathInput])

  const handleCssToXpath = useCallback(() => {
    setStatus(null)
    const { result, error } = cssToXpath(cssInput)
    if (error) {
      setStatus({ type: "error", message: error })
      return
    }
    setXpathInput(result)
    setStatus({ type: "success", message: "Converted CSS to XPath." })
  }, [cssInput])

  const copyToClipboard = useCallback(
    async (text: string, side: "xpath" | "css") => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        const textarea = document.createElement("textarea")
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
      }
      if (side === "xpath") {
        setCopiedXpath(true)
        setTimeout(() => setCopiedXpath(false), 2000)
      } else {
        setCopiedCss(true)
        setTimeout(() => setCopiedCss(false), 2000)
      }
    },
    []
  )

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
              XPath &harr; CSS Selector Converter
            </h1>
            <Badge variant="secondary" className="text-xs">
              Free Tool by Scraper.bot
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Convert between XPath expressions and CSS selectors instantly.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Status */}
          {status && (
            <div
              className={`flex items-start gap-2 text-sm rounded-md p-3 ${
                status.type === "success"
                  ? "text-green-600 bg-green-50 dark:bg-green-950/30"
                  : "text-red-600 bg-red-50 dark:bg-red-950/30"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              )}
              {status.message}
            </div>
          )}

          {/* Converter */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      XPath Expression
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => copyToClipboard(xpathInput, "xpath")}
                      disabled={!xpathInput}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {copiedXpath ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={xpathInput}
                    onChange={(e) => setXpathInput(e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="//div[@class='product']/span"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col items-center justify-center gap-2 py-2 lg:py-0">
              <Button size="sm" onClick={handleXpathToCss} className="w-36">
                XPath &rarr; CSS
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCssToXpath}
                className="w-36"
              >
                CSS &rarr; XPath
              </Button>
            </div>

            <div className="flex-1 min-w-0">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      CSS Selector
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => copyToClipboard(cssInput, "css")}
                      disabled={!cssInput}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      {copiedCss ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={cssInput}
                    onChange={(e) => setCssInput(e.target.value)}
                    rows={4}
                    className="font-mono text-sm"
                    placeholder="div.product > span"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reference Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Common Conversions Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left font-medium py-2 pr-4">
                        XPath
                      </th>
                      <th className="text-left font-medium py-2 pl-4">CSS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REFERENCE_TABLE.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-2 pr-4">
                          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                            {row.xpath}
                          </code>
                        </td>
                        <td className="py-2 pl-4">
                          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                            {row.css}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Powered by{" "}
            <span className="font-serif font-semibold">
              Scraper<span className="text-blue-600 dark:text-blue-400">.bot</span>
            </span>
          </p>
          <Link href="/pricing">
            <Button variant="default">
              Build scrapers with visual selectors
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
